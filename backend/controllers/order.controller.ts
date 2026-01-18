
import { OrderService } from '../services/order.service';
import { createResponse, createErrorResponse } from '../utils/responseHandler';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    async createOrder(items: any[], _clientTotal: number) {
        try {
            // Note: _clientTotal is ignored as we calculate server-side for security
            const order = await this.orderService.createOrder(items);
            return createResponse(order, 201);
        } catch (error: any) {
            // Check for known app errors
            const status = error.statusCode || 500;
            return createErrorResponse(error.message, status);
        }
    }

    async listOrders() {
        try {
            const orders = await this.orderService.listOrders();
            return createResponse(orders);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }

    async updateStatus(id: string, status: string) {
        try {
            const order = await this.orderService.updateOrderStatus(id, status);
            return createResponse(order);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }
}

