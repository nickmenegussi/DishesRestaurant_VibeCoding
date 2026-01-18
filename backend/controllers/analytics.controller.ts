
import { AnalyticsService } from '../services/analytics.service';
import { createResponse, createErrorResponse } from '../utils/responseHandler';

export class AnalyticsController {
    private analyticsService: AnalyticsService;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    async getOrderReports(query: any = {}) {
        try {
            const { startDate, endDate } = query;
            const now = new Date();
            const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const defaultEnd = now.toISOString();

            const reports = await this.analyticsService.getOrderReports(
                startDate || defaultStart,
                endDate || defaultEnd
            );
            return createResponse(reports);
        } catch (error: any) {
            return createErrorResponse(error.message, error.status || 500);
        }
    }

    async getDishReports() {
        try {
            const reports = await this.analyticsService.getDishReports();
            return createResponse(reports);
        } catch (error: any) {
            return createErrorResponse(error.message, error.status || 500);
        }
    }

    async getAIPerformance(query: any = {}) {
        try {
            const { startDate, endDate } = query;
            const now = new Date();
            const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const defaultEnd = now.toISOString();

            const reports = await this.analyticsService.getAIPerformance(
                startDate || defaultStart,
                endDate || defaultEnd
            );
            return createResponse(reports);
        } catch (error: any) {
            return createErrorResponse(error.message, error.status || 500);
        }
    }

    async getStrategicInsights() {
        try {
            const insights = await this.analyticsService.getStrategicInsights();
            return createResponse(insights);
        } catch (error: any) {
            console.error('[AnalyticsController] Strategic Insights failed:', error);
            return createErrorResponse(error.message, 500);
        }
    }

    async logAIAction(data: any) {
        try {
            const { action, dishId } = data;
            const log = await this.analyticsService.logAIAction(action, dishId);
            return createResponse(log, 201);
        } catch (error: any) {
            return createErrorResponse(error.message, error.status || 500);
        }
    }
}
