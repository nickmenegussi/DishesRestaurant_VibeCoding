import { DishController } from '../controllers/dish.controller';

const dishController = new DishController();

/**
 * Dish Routes
 */
export const dishRoutes = {
    list: (options: any = {}) => dishController.listDishes(options),
    get: (id: string) => dishController.getDish(id),
    search: (query: string) => dishController.searchDishes(query),
    create: (data: any) => dishController.createDish(data),
    update: (id: string, data: any) => dishController.updateDish(id, data),
    delete: (id: string) => dishController.deleteDish(id),
    toggleActive: (id: string, active: boolean) => dishController.toggleActive(id, active),
};

