import { DishRepository } from '../repositories/dish.repository';
import { MenuRepository } from '../repositories/menu.repository';
import { AppError } from '../utils/errorHandler';
import { validateStringLength, isValidPrice, isValidUUID } from '../utils/validators';
import type { Dish, Menu } from '../utils/supabaseClient';

export class MenuService {
    private dishRepo: DishRepository;
    private menuRepo: MenuRepository;

    constructor() {
        this.dishRepo = new DishRepository();
        this.menuRepo = new MenuRepository();
    }

    // DISHES
    async getAllDishes(admin = false): Promise<Dish[]> {
        return this.dishRepo.getAll(admin ? {} : { active: true });
    }

    async listDishesPaginated(params: { page: number, pageSize: number, search?: string, admin?: boolean, active?: boolean }) {
        return this.dishRepo.listPaginated(params);
    }

    async getDishById(id: string): Promise<Dish> {
        if (!isValidUUID(id)) throw new AppError('Invalid Dish ID', 400);
        const dish = await this.dishRepo.getById(id);
        if (!dish) throw new AppError('Dish not found', 404);
        return dish;
    }

    async createDish(data: Partial<Dish>): Promise<Dish> {
        this.validateDishData(data);
        return this.dishRepo.create(data);
    }

    async updateDish(id: string, data: Partial<Dish>): Promise<Dish> {
        if (!isValidUUID(id)) throw new AppError('Invalid Dish ID', 400);
        this.validateDishData(data, true);
        return this.dishRepo.update(id, data);
    }

    async deleteDish(id: string): Promise<void> {
        if (!isValidUUID(id)) throw new AppError('Invalid Dish ID', 400);
        // Hard delete as requested
        await this.dishRepo.delete(id);
    }

    async toggleDishActive(id: string, active: boolean): Promise<Dish> {
        if (!isValidUUID(id)) throw new AppError('Invalid Dish ID', 400);
        return this.dishRepo.toggleActive(id, active);
    }

    async searchDishes(query: string): Promise<Dish[]> {
        if (!query) return [];
        return this.dishRepo.searchByName(query);
    }

    // MENUS
    async getActiveMenus(): Promise<Menu[]> {
        return this.menuRepo.listActive();
    }

    async listAllMenus(): Promise<Menu[]> {
        return this.menuRepo.getAll();
    }

    async getMenuById(id: string): Promise<Menu> {
        if (!isValidUUID(id)) throw new AppError('Invalid Menu ID', 400);
        const menu = await this.menuRepo.getById(id);
        if (!menu) throw new AppError('Menu not found', 404);
        return menu;
    }

    async createMenu(data: Partial<Menu>): Promise<Menu> {
        if (!validateStringLength(data.name || '', 2, 50)) {
            throw new AppError('Menu name must be between 2 and 50 characters', 400);
        }
        return this.menuRepo.create(data);
    }

    async updateMenu(id: string, data: Partial<Menu>): Promise<Menu> {
        if (!isValidUUID(id)) throw new AppError('Invalid Menu ID', 400);
        return this.menuRepo.update(id, data);
    }

    async deleteMenu(id: string): Promise<void> {
        if (!isValidUUID(id)) throw new AppError('Invalid Menu ID', 400);
        await this.menuRepo.update(id, { active: false });
    }

    // RELATIONSHIPS
    async attachDishToMenu(menuId: string, dishId: string): Promise<void> {
        if (!isValidUUID(menuId) || !isValidUUID(dishId)) {
            throw new AppError('Invalid ID provided', 400);
        }
        await this.menuRepo.attachDish(menuId, dishId);
    }

    async detachDishFromMenu(menuId: string, dishId: string): Promise<void> {
        if (!isValidUUID(menuId) || !isValidUUID(dishId)) {
            throw new AppError('Invalid ID provided', 400);
        }
        await this.menuRepo.detachDish(menuId, dishId);
    }

    async listDishesByMenu(menuId: string): Promise<Dish[]> {
        if (!isValidUUID(menuId)) throw new AppError('Invalid Menu ID', 400);
        return this.menuRepo.getDishesByMenu(menuId);
    }

    private validateDishData(data: Partial<Dish>, isUpdate = false) {
        if (!isUpdate || data.name !== undefined) {
            if (!validateStringLength(data.name || '', 2, 100)) {
                throw new AppError('Dish name must be between 2 and 100 characters', 400);
            }
        }
        if (!isUpdate || data.price !== undefined) {
            if (!isValidPrice(data.price || 0)) {
                throw new AppError('Invalid dish price', 400);
            }
        }
        if (!isUpdate || data.category !== undefined) {
            if (!validateStringLength(data.category || '', 2, 50)) {
                throw new AppError('Category must be between 2 and 50 characters', 400);
            }
        }
        // Description validation - 10-500 characters as per requirements
        if (!isUpdate || data.description !== undefined) {
            if (data.description && !validateStringLength(data.description, 10, 500)) {
                throw new AppError('Description must be between 10 and 500 characters', 400);
            }
        }
    }
}

