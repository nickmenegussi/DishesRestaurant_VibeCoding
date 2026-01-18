
import { supabase } from '../utils/supabaseClient';
import { AppError } from '../utils/errorHandler';

export class OrderRepository {
    async createOrder(orderData: { total_price: number, status: string }) {
        const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();

        if (error) throw new AppError(error.message, 400);
        return data;
    }

    async createOrderItems(items: any[]) {
        const { error } = await supabase
            .from('order_items')
            .insert(items);

        if (error) throw new AppError(error.message, 400);
    }

    async getByIdWithItems(id: string) {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, dishes(*))')
            .eq('id', id)
            .single();

        if (error) throw new AppError(error.message, 404);
        return data;
    }

    async updateStatus(id: string, status: string) {
        const { data, error } = await supabase
            .from('orders')
            .update({ status } as any)
            .eq('id', id)
            .select();

        if (error) throw new AppError(error.message, 400);

        // Supabase returns an empty array if RLS blocks the update or if no record matches the filter
        if (!data || data.length === 0) {
            throw new AppError('Order not found or permission denied (check RLS policies)', 404);
        }

        return data[0];
    }

    async listAll() {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, dishes(name, image))')
            .order('created_at', { ascending: false });

        if (error) throw new AppError(error.message, 500);
        return data;
    }
}

