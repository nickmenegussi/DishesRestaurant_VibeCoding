import { OrderRepository } from '../repositories/order.repository';
import { DishRepository } from '../repositories/dish.repository';
import { AppError } from '../utils/errorHandler';
import { isValidQuantity, isValidUUID } from '../utils/validators';

export class OrderService {
    private orderRepo: OrderRepository;
    private dishRepo: DishRepository;

    constructor() {
        this.orderRepo = new OrderRepository();
        this.dishRepo = new DishRepository();
    }

    async createOrder(items: { id: string, quantity: number }[]) {
        if (!items || items.length === 0) {
            throw new AppError('Order must contain items', 400);
        }

        // 1. Fetch valid dishes to verify prices and activity
        const dishIds = items.map(i => i.id);
        const dishes = await Promise.all(
            dishIds.map(id => {
                if (!isValidUUID(id)) throw new AppError(`Invalid Dish ID: ${id}`, 400);
                return this.dishRepo.getById(id);
            })
        );

        let totalCalculated = 0;
        const validOrderItems = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const dish = dishes[i];

            if (!dish) {
                throw new AppError(`Dish with id ${item.id} not found`, 404);
            }
            if (!dish.active) {
                throw new AppError(`Dish ${dish.name} is no longer available`, 400);
            }
            if (!isValidQuantity(item.quantity)) {
                throw new AppError(`Invalid quantity for dish ${dish.name}`, 400);
            }

            const itemTotal = dish.price * item.quantity;
            totalCalculated += itemTotal;

            validOrderItems.push({
                dish_id: dish.id,
                quantity: item.quantity,
                unit_price: dish.price // Store historical price
            });
        }

        // 2. Create Order
        const order = await this.orderRepo.createOrder({
            total_price: totalCalculated,
            status: 'pending'
        });

        // 3. Create Order Items linked to order
        const itemsWithOrder = validOrderItems.map(i => ({
            ...i,
            order_id: order.id
        }));

        await this.orderRepo.createOrderItems(itemsWithOrder);

        // Return full order details
        return this.orderRepo.getByIdWithItems(order.id);
    }

    async getOrderDetails(id: string) {
        if (!isValidUUID(id)) throw new AppError('Invalid Order ID', 400);
        return this.orderRepo.getByIdWithItems(id);
    }

    async listOrders() {
        return this.orderRepo.listAll();
    }

    async updateOrderStatus(id: string, status: string) {
        if (!isValidUUID(id)) throw new AppError('Invalid Order ID', 400);
        const validStatuses = ['pending', 'confirmed', 'completed', 'canceled'];
        if (!validStatuses.includes(status)) {
            throw new AppError('Invalid order status', 400);
        }
        return this.orderRepo.updateStatus(id, status);
    }
}

