
import { supabase } from '../utils/supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export class AuthService {
    async login(email: string, password: string) {
        // Diagnostic Logging
        const maskedPassword = password ? `${password[0]}${'*'.repeat(password.length - 2)}${password[password.length - 1]}` : 'EMPTY';
        console.log(`[AuthService] Attempting login for: ${email}`);
        console.log(`[AuthService] Password Masked: ${maskedPassword} (Length: ${password?.length || 0})`);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error(`[AuthService] Login failed for ${email}:`, error);
            throw error;
        }

        console.log(`[AuthService] Login successful for: ${email}`);
        return data;
    }

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    async getSession() {
        const { data } = await supabase.auth.getSession();
        return data.session;
    }

    onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
        return supabase.auth.onAuthStateChange(callback);
    }
    async updateUser(attributes: { data?: { full_name?: string, avatar_url?: string, bio?: string }, password?: string }) {
        const { data, error } = await supabase.auth.updateUser(attributes);
        if (error) {
            console.error('[AuthService] Update failed:', error);
            throw error;
        }
        return data;
    }
}
