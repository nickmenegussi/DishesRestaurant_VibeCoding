
import { supabase } from '../utils/supabaseClient';
import { AppError } from '../utils/errorHandler';

export abstract class BaseRepository<T> {
    protected table: string;

    constructor(table: string) {
        this.table = table;
    }

    async getAll(query: any = {}): Promise<T[]> {
        let builder = supabase.from(this.table).select('*');

        // Simple equality filters
        Object.keys(query).forEach(key => {
            builder = builder.eq(key, query[key]);
        });

        const { data, error } = await builder;
        if (error) throw new AppError(error.message, 500);
        return data as T[];
    }

    async getById(id: string): Promise<T | null> {
        const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single();
        if (error) return null;
        return data as T;
    }

    async create(item: Partial<T>): Promise<T> {
        const { data, error } = await supabase.from(this.table).insert(item).select().single();
        if (error) throw new AppError(error.message, 400);
        return data as T;
    }

    async update(id: string, item: Partial<T>): Promise<T> {
        const { data, error } = await supabase.from(this.table).update(item).eq('id', id).select().single();
        if (error) throw new AppError(error.message, 400);
        return data as T;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from(this.table).delete().eq('id', id);
        if (error) throw new AppError(error.message, 400);
    }
}
