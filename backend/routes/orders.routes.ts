import { OrderController } from '../controllers/order.controller';
import { AppError } from '../utils/errorHandler';

const orderController = new OrderController();

/**
 * Order Routes
 */
export const orderRoutes = {
    // POST /orders
    placeOrder: async (data: { items: any[], total: number }) => {
        if (!data.items || !Array.isArray(data.items)) {
            throw new AppError('Invalid items format', 400);
        }
        return orderController.createOrder(data.items, data.total);
    },

    list: () => orderController.listOrders(),
    updateStatus: (id: string, status: string) => orderController.updateStatus(id, status),
};

