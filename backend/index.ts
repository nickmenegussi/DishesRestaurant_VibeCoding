import { dishRoutes } from './routes/dishes.routes';
import { menuRoutes } from './routes/menus.routes';
import { orderRoutes } from './routes/orders.routes';
import { authRoutes } from './routes/auth.routes';
import { aiRoutes } from './routes/ai.routes';
import { storageRoutes } from './routes/storage.routes';
import { analyticsRoutes } from './routes/analytics.routes';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const menuService = {
    getDishes: async (options: any = {}) => {
        const res = await dishRoutes.list(options);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    listDishesPaginated: async (params: any) => {
        const res = await dishRoutes.list(params);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    getDish: async (id: string) => {
        const res = await dishRoutes.get(id);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    createDish: async (data: any) => {
        const res = await dishRoutes.create(data);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    updateDish: async (id: string, data: any) => {
        const res = await dishRoutes.update(id, data);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    deleteDish: async (id: string) => {
        const res = await dishRoutes.delete(id);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    searchDishes: async (query: string) => {
        const res = await dishRoutes.search(query);
        if (res.error) throw new Error(res.error);
        return res.data || [];
    },
    toggleDishActive: async (id: string, active: boolean) => {
        const res = await dishRoutes.toggleActive(id, active);
        if (res.error) throw new Error(res.error);
        return res.data;
    },

    getMenus: async (admin = false) => {
        const res = admin ? await menuRoutes.listAll() : await menuRoutes.list();
        if (res.error) throw new Error(res.error);
        return res.data || [];
    },
    createMenu: async (data: any) => {
        const res = await menuRoutes.create(data);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    getMenuDishes: async (menuId: string) => {
        const res = await menuRoutes.getDishes(menuId);
        if (res.error) throw new Error(res.error);
        return res.data || [];
    },
    attachDish: async (menuId: string, dishId: string) => {
        const res = await menuRoutes.attachDish(menuId, dishId);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    detachDish: async (menuId: string, dishId: string) => {
        const res = await menuRoutes.detachDish(menuId, dishId);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
};

export const orderService = {
    createOrder: async (items: any[], total: number) => {
        const res = await orderRoutes.placeOrder({ items, total });
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    listOrders: async () => {
        const res = await orderRoutes.list();
        if (res.error) throw new Error(res.error);
        return res.data || [];
    },
    updateOrderStatus: async (id: string, status: string) => {
        const res = await orderRoutes.updateStatus(id, status);
        if (res.error) throw new Error(res.error);
        return res.data;
    }
};

import { DashboardRepository } from './repositories/dashboard.repository';

const dashboardRepo = new DashboardRepository();

export const dashboardService = {
    getStats: async () => {
        return dashboardRepo.getStats();
    }
};

export const aiService = {
    getSuggestions: async (name: string, ingredients: string[], imageBase64?: string) => {
        const res = await aiRoutes.suggest(name, ingredients, imageBase64);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    chat: async (message: string, context: string) => {
        const res = await aiRoutes.chat(message, context);
        if (res.error) throw new Error(res.error);
        return res.data;
    }
};

export const authService = {
    login: (e: string, p: string) => authRoutes.login(e, p),
    logout: () => authRoutes.logout(),
    getSession: () => authRoutes.session(),
    onAuthStateChange: (cb: (event: AuthChangeEvent, session: Session | null) => void) => authRoutes.onStateChange(cb),
    getUser: async () => {
        const session = await authRoutes.session();
        return session?.user ?? null;
    },
    updateUser: (attributes: { data?: { full_name?: string }, password?: string }) => authRoutes.updateUser(attributes)
};

export const storageService = {
    uploadDishImage: async (file: File) => {
        const res = await storageRoutes.uploadDishImage(file);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    uploadProfileImage: async (file: File, userId: string) => {
        const res = await storageRoutes.uploadProfileImage(file, userId);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    deleteImage: async (path: string) => {
        const res = await storageRoutes.deleteImage(path);
        if (res.error) throw new Error(res.error);
        return res.data;
    }
};

export const analyticsService = {
    getOrders: async (query: any = {}) => {
        const res = await analyticsRoutes.getOrders(query);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    getDishes: async () => {
        const res = await analyticsRoutes.getDishes();
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    getAIPerformance: async (query: any = {}) => {
        const res = await analyticsRoutes.getAIPerformance(query);
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    getStrategicInsights: async () => {
        const res = await analyticsRoutes.getStrategicInsights();
        if (res.error) throw new Error(res.error);
        return res.data;
    },
    logAIAction: async (data: any) => {
        const res = await analyticsRoutes.logAIAction(data);
        if (res.error) throw new Error(res.error);
        return res.data;
    }
};
