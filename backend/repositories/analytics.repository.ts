
import { supabase } from '../utils/supabaseClient';
import { AppError } from '../utils/errorHandler';

export class AnalyticsRepository {
    async getOrderStats(startDate: string, endDate: string) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (error) throw new AppError(error.message, 500);
        return data;
    }

    async getOrderItemsWithDishes(startDate: string, endDate: string) {
        const { data, error } = await supabase
            .from('order_items')
            .select('*, dishes(name, category)')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (error) throw new AppError(error.message, 500);
        return data;
    }

    async getDishStats() {
        const { data, error } = await supabase
            .from('dishes')
            .select('id, name, category, active, created_at');

        if (error) throw new AppError(error.message, 500);
        return data;
    }

    async getAILogs(startDate: string, endDate: string) {
        const { data, error } = await supabase
            .from('ai_analytics_logs')
            .select('*')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (error) throw new AppError(error.message, 500);
        return data;
    }

    async logAIAction(action: 'generated' | 'applied' | 'discarded', dishId?: string, metadata: any = {}) {
        const { data, error } = await supabase
            .from('ai_analytics_logs')
            .insert({
                action,
                dish_id: dishId,
                metadata
            })
            .select()
            .single();

        if (error) throw new AppError(error.message, 400);
        return data;
    }

    async getTopDishes(limit: number = 5) {
        const { data, error } = await supabase
            .rpc('get_top_dishes', { limit_count: limit });

        if (error) {
            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .select('dish_id, quantity, dishes(name)');

            if (itemsError) throw new AppError(itemsError.message, 500);
            return items;
        }
        return data;
    }

    async getStrategicData() {
        // 1. Category Performance
        const { data: categoryData, error: catError } = await supabase.rpc('get_category_performance');

        // 2. AI vs Manual Performance
        const { data: aiManualData, error: aiError } = await supabase.rpc('get_ai_manual_comparison');

        // 3. Status Distribution
        const { data: statusData, error: statusError } = await supabase
            .from('orders')
            .select('status');

        if (catError || aiError || statusError) {
            // If RPCs are not available, we do basic fallback aggregation
            const { data: dishes } = await supabase.from('dishes').select('id, category, is_ai_generated');
            const { data: orderItems } = await supabase.from('order_items').select('dish_id, quantity, total_price');

            return {
                fallback: true,
                dishes,
                orderItems
            };
        }

        return {
            categories: categoryData,
            aiPerformance: aiManualData,
            statusDistribution: statusData
        };
    }
}
