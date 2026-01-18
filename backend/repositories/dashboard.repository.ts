import { supabase } from '../utils/supabaseClient';
import { AppError } from '../utils/errorHandler';

export class DashboardRepository {
    async getStats() {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('status, total_price, created_at');

        if (error) throw new AppError(error.message, 500);

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);

        const statusDistribution = orders.reduce((acc: any, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {
            pending: 0,
            confirmed: 0,
            completed: 0,
            canceled: 0
        });

        // Get latest 5 orders with items for preview
        const { data: recentOrders, error: recentError } = await supabase
            .from('orders')
            .select('*, order_items(*, dishes(name))')
            .order('created_at', { ascending: false })
            .limit(5);

        if (recentError) throw new AppError(recentError.message, 500);

        return {
            summary: {
                totalOrders,
                totalRevenue,
                statusDistribution
            },
            recentOrders
        };
    }
}
