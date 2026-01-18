
import { AIService } from '../services/ai.service';
import { createResponse, createErrorResponse } from '../utils/responseHandler';

export class AIController {
    private aiService: AIService;

    constructor() {
        this.aiService = new AIService();
    }

    async getSuggestions(name: string, ingredients: string[], imageBase64?: string) {
        try {
            if (!name) {
                return createErrorResponse('Dish name is required for suggestions', 400);
            }
            const suggestions = await this.aiService.generateDishSuggestions(name, ingredients, imageBase64);
            return createResponse(suggestions);
        } catch (error: any) {
            return createErrorResponse(error.message, 500);
        }
    }

    async chat(message: string, context: string) {
        try {
            if (!message) {
                return createErrorResponse('Message is required', 400);
            }
            const response = await this.aiService.chat(message, context);
            return createResponse(response);
        } catch (error: any) {
            return createErrorResponse(error.message, 500);
        }
    }
}
