
import { AIController } from '../controllers/ai.controller';

const aiController = new AIController();

export const aiRoutes = {
    suggest: (name: string, ingredients: string[], imageBase64?: string) => aiController.getSuggestions(name, ingredients, imageBase64),
    chat: (message: string, context: string) => aiController.chat(message, context),
};
