
import { BaseRepository } from './base.repository';
import type { Dish } from '../utils/supabaseClient';
import { supabase } from '../utils/supabaseClient';
import { AppError } from '../utils/errorHandler';

export class DishRepository extends BaseRepository<Dish> {
    constructor() {
        super('dishes');
    }

    // Specific method to find by category
    async findByCategory(category: string): Promise<Dish[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('category', category)
            .eq('active', true);

        if (error) throw error;
        return data as Dish[];
    }

    async searchByName(name: string): Promise<Dish[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .ilike('name', `%${name}%`)
            .eq('active', true);

        if (error) throw error;
        return data as Dish[];
    }

    async toggleActive(id: string, active: boolean): Promise<Dish> {
        const { data, error } = await supabase
            .from(this.table)
            .update({ active } as any)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Dish;
    }

    async listPaginated(params: { page: number, pageSize: number, search?: string, admin?: boolean, active?: boolean }) {
        const { page, pageSize, search, admin, active } = params;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
            .from(this.table)
            .select('*, menu_dishes(menus(name))', { count: 'exact' });

        if (search) {
            query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
        }

        // If explicit active filter provided, use it
        if (active !== undefined) {
            query = query.eq('active', active);
        } else if (!admin) {
            // Default public filter
            query = query.eq('active', true);
        }

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw new AppError(error.message, 500);

        return {
            data: data as any[],
            total: count || 0
        };
    }
}

