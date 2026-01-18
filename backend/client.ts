
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Dish = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    active: boolean;
    pairing?: string;
    ingredient_suggestions?: string[];
    tags?: string[];
};

export type Menu = {
    id: string;
    name: string;
    description: string;
    active: boolean;
};
