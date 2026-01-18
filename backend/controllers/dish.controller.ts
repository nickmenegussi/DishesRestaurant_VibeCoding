
import { MenuService } from '../services/menu.service';
import { createResponse, createErrorResponse } from '../utils/responseHandler';

export class DishController {
    private menuService: MenuService;

    constructor() {
        this.menuService = new MenuService();
    }

    async listDishes(options: any = {}) {
        try {
            if (options.page && options.pageSize) {
                const result = await this.menuService.listDishesPaginated(options);
                return createResponse(result);
            }
            const dishes = await this.menuService.getAllDishes(options.admin);
            return createResponse(dishes);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }

    async getDish(id: string) {
        try {
            const dish = await this.menuService.getDishById(id);
            return createResponse(dish);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 404);
        }
    }

    async searchDishes(query: string) {
        try {
            const dishes = await this.menuService.searchDishes(query);
            return createResponse(dishes);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }

async toggleActive(id: string, active: boolean) {
        try {
            const dish = await this.menuService.toggleDishActive(id, active);
            return createResponse(dish);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }

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
            return createResponse({ message: 'Dish deleted successfully' });
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 400);
        }
    }
}
