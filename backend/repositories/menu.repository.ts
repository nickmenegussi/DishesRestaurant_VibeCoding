import { BaseRepository } from './base.repository';
import type { Menu, Dish } from '../utils/supabaseClient';
import { supabase } from '../utils/supabaseClient';

export class MenuRepository extends BaseRepository<Menu> {
    constructor() {
        super('menus');
    }

    async attachDish(menuId: string, dishId: string): Promise<void> {
        const { error } = await supabase
            .from('menu_dishes')
            .insert({ menu_id: menuId, dish_id: dishId } as any);

        if (error) {
            if (error.code === '23505') return; // Ignore duplicates
            throw error;
        }
    }

    async detachDish(menuId: string, dishId: string): Promise<void> {
        const { error } = await supabase
            .from('menu_dishes')
            .delete()
            .eq('menu_id', menuId)
            .eq('dish_id', dishId);

        if (error) throw error;
    }

    async getDishesByMenu(menuId: string): Promise<Dish[]> {
        const { data, error } = await supabase
            .from('menu_dishes')
            .select('dishes(*)')
            .eq('menu_id', menuId)
            .eq('dishes.active', true);

        if (error) throw error;
        return (data as any[]).map(item => item.dishes).filter(Boolean) as Dish[];
    }

    async listActive(): Promise<Menu[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('active', true);

        if (error) throw error;
        return data as Menu[];
    }
}

