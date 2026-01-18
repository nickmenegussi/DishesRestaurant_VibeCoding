import { AuthController } from '../controllers/auth.controller';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

const authController = new AuthController();

/**
 * Auth Routes
 */
export const authRoutes = {
    // POST /auth/login
    login: (email: string, pass: string) => authController.login(email, pass),

    // POST /auth/logout
    logout: () => authController.logout(),

    // GET /auth/session
    session: () => authController.getSession(),

    // AUTH_CHANGE_LISTENER
    onStateChange: (cb: (event: AuthChangeEvent, session: Session | null) => void) => authController.onStateChange(cb),

    // UPDATE USER
    updateUser: (attributes: { data?: { full_name?: string }, password?: string }) => authController.updateUser(attributes),
};
