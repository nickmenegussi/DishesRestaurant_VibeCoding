import { StorageController } from '../controllers/storage.controller';

const storageController = new StorageController();

export const storageRoutes = {
    uploadDishImage: (file: File) => storageController.uploadDishImage(file),
    uploadProfileImage: (file: File, userId: string) => storageController.uploadProfileImage(file, userId),
    deleteImage: (path: string) => storageController.deleteImage(path),
};