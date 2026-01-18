import { MenuController } from '../controllers/menu.controller';

const menuController = new MenuController();

/**
 * Menu Routes
 */
export const menuRoutes = {
    list: () => menuController.getCategories(),
    listAll: () => menuController.getMenus(),
    create: (data: any) => menuController.createMenu(data),
    attachDish: (menuId: string, dishId: string) => menuController.attachDish(menuId, dishId),
    detachDish: (menuId: string, dishId: string) => menuController.detachDish(menuId, dishId),
    getDishes: (menuId: string) => menuController.getMenuDishes(menuId),
};

