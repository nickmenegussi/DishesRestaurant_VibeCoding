import { AuthService } from '../services/auth.service';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Auth is slightly different as it returns Supabase session objects directly often
export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(email: string, pass: string) {
        return this.authService.login(email, pass);
    }

    async logout() {
        return this.authService.logout();
    }

    async getSession() {
        return this.authService.getSession();
    }

    onStateChange(cb: (event: AuthChangeEvent, session: Session | null) => void) {
        return this.authService.onAuthStateChange(cb);
    }
    async updateUser(attributes: { data?: { full_name?: string }, password?: string }) {
        return this.authService.updateUser(attributes);
    }
}
