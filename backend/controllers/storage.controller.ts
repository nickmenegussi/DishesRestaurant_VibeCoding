import { StorageRepository } from '../repositories/storage.repository';
import { createResponse, createErrorResponse } from '../utils/responseHandler';

export class StorageController {
    private storageRepo: StorageRepository;

    constructor() {
        this.storageRepo = new StorageRepository();
    }

    async uploadDishImage(file: File) {
        try {
            const imageUrl = await this.storageRepo.uploadDishImage(file);
            return createResponse({ url: imageUrl }, 201);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }

    async uploadProfileImage(file: File, userId: string) {
        try {
            const imageUrl = await this.storageRepo.uploadProfileImage(file, userId);
            return createResponse({ url: imageUrl }, 201);
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }

    async deleteImage(path: string) {
        try {
            await this.storageRepo.deleteImage(path);
            return createResponse({ message: 'Image deleted successfully' });
        } catch (error: any) {
            return createErrorResponse(error.message, error.statusCode || 500);
        }
    }
}