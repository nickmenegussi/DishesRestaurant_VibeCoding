
import { GoogleGenAI } from "@google/genai";

export class AIService {
    private client: GoogleGenAI;

    constructor() {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('VITE_GEMINI_API_KEY not found in environment');
        }
        this.client = new GoogleGenAI({ apiKey });
    }

    
    async generateDishSuggestions(name: string, ingredients: string[], imageBase64?: string) {
        if (!this.client) throw new Error('AI Service unavailable: Client not initialized');

        const prompt = `
            Context: You are a professional menu consultant for "Global Bites Menu".
            Objective: Enhance the dish creation process for a new dish.
            
            Input:
            Dish Name: "${name}"
            Ingredients: ${ingredients.join(', ')}
            
            Required Features:
            1. description: Appetizing storytelling description (MAX 300 characters). PLAIN TEXT ONLY. NO special characters or markdown.
            2. tags: Array of short strings (e.g., "Vegetarian", "Spicy").
            3. pairing: Single string suggesting a beverage or side dish.
            4. ingredient_suggestions: Array of 1-2 creative additions.
            
            Return ONLY a JSON object with this exact structure:
            {
              "description": "...",
              "tags": ["..."],
              "pairing": "...",
              "ingredient_suggestions": ["..."]
            }
        `;

        try {
            const parts: any[] = [{ text: prompt }];

            // If an image is provided, add it to the parts for multimodal analysis
            if (imageBase64) {
                // Remove data URL prefix if present
                const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg", // Default to jpeg, but ideally should be dynamic
                        data: cleanBase64
                    }
                });
            }

            // Using models.generateContent as per documentation for gemini-3-flash-preview
            const result = await this.client.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [{ role: 'user', parts }]
            });

            // The SDK returns the response text directly or via result.text
            const text = result.text || "";

            if (!text) {
                throw new Error('AI returned an empty response');
            }

            // Extract JSON from potential markdown wrapping
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? jsonMatch[0] : text;

            try {
                return JSON.parse(jsonText);
            } catch (parseError) {
                console.error('Failed to parse AI JSON:', jsonText);
                throw new Error('AI response was not valid JSON');
            }
        } catch (error: any) {
            console.error('Gemini API Error:', error);
            // Provide more specific error messages for known issues
            if (error.message?.includes('404')) {
                throw new Error('Gemini Model not found. Please verify the model name and API version.');
            }
            throw new Error(error.message || 'AI Generation failed');
        }
    }

    /**
     * Chat with the AI Chef Assistant.
     * @param message User's message
     * @param context Context about the menu items
     * @returns AI response text
     */
    async chat(message: string, context: string) {
        if (!this.client) throw new Error('AI Service unavailable');

        try {
            const prompt = `
            System: You are a helpful, friendly, and appetizing AI Chef Assistant for "Global Bites". 
            Your goal is to help customers choose dishes from our menu.
            
            Current Menu:
            ${context}
            
            Rules:
            1. Only recommend dishes present in the menu context.
            2. Be concise but enthusiastic.
            3. If you recommend a dish, mention its exact name so I can highlight it.
            4. If the user asks about something not on the menu, suggest the closest alternative or politely say we don't have it.
            
            User Message: "${message}"
            `;

            const result = await this.client.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });

            const text = result.text || "";
            if (!text) throw new Error('Empty response from AI');

            return text;

        } catch (error: any) {
            console.error('AI Chat Error:', error);
            throw new Error(error.message || 'Failed to chat with AI');
        }
    }

    /**
     * Analyzes strategic data and returns business insights.
     */
    async analyzeStrategicData(data: any) {
        if (!this.client) throw new Error('AI Service unavailable');

        const prompt = `
            Context: You are a Senior Business Analyst for a restaurant chain.
            Data: ${JSON.stringify(data)}

            Objective: Analyze the provided reports (revenue, categories, AI-generated dish performance) and provide strategic insights.

            Requirements:
            1. summary: A 2-sentence executive summary of the business health.
            2. insights: Array of objects with:
               - type: "trend" | "alert" | "recommendation"
               - text: The insight itself (concise and action-oriented).
            3. priority: "high" | "medium" | "low" based on the most critical insight.

            Return ONLY a JSON object.
        `;

        try {
            const result = await this.client.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });

            const text = result.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            return JSON.parse(jsonMatch ? jsonMatch[0] : text);
        } catch (error) {
            console.error('Strategic Analysis Error:', error);
            return {
                summary: "Strategic data analysis is currently unavailable.",
                insights: [],
                priority: "low"
            };
        }
    }
}
