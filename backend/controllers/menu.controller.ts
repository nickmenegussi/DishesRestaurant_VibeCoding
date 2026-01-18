
import { MenuService } from '../services/menu.service';
import { createResponse, createErrorResponse } from '../utils/responseHandler';

export class MenuController {
    private menuService: MenuService;

    constructor() {
        this.menuService = new MenuService();
    }

    async getPublicMenu() {
        try {
            const dishes = await this.menuService.getAllDishes(false);
            return createResponse(dishes);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }

    async getCategories() {
        try {
            const menus = await this.menuService.getActiveMenus();
            return createResponse(menus);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }

    async getMenus() {
        try {
            const menus = await this.menuService.listAllMenus();
            return createResponse(menus);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }

    async createMenu(data: any) {
        try {
            const menu = await this.menuService.createMenu(data);
            return createResponse(menu, 201);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }

    // DISH ADMIN
    async createDish(data: any) {
        try {
            const dish = await this.menuService.createDish(data);
            return createResponse(dish, 201);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }

    async updateDish(id: string, data: any) {
        try {
            const dish = await this.menuService.updateDish(id, data);
            return createResponse(dish);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }

    async deleteDish(id: string) {
        try {
            await this.menuService.deleteDish(id);
            return createResponse({ message: 'Dish deleted (soft)' });
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }

    // RELATIONSHIPS
    async attachDish(menuId: string, dishId: string) {
        try {
            await this.menuService.attachDishToMenu(menuId, dishId);
            return createResponse({ message: 'Dish attached to menu' });
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }

    async detachDish(menuId: string, dishId: string) {
        try {
            await this.menuService.detachDishFromMenu(menuId, dishId);
            return createResponse({ message: 'Dish detached from menu' });
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }

    async getMenuDishes(menuId: string) {
        try {
            const dishes = await this.menuService.listDishesByMenu(menuId);
            return createResponse(dishes);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }
}

