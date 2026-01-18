import { AnalyticsController } from '../controllers/analytics.controller';

const controller = new AnalyticsController();

export const analyticsRoutes = {
    getOrders: (query: any) => controller.getOrderReports(query),
    getDishes: () => controller.getDishReports(),
    getAIPerformance: (query: any) => controller.getAIPerformance(query),
    getStrategicInsights: () => controller.getStrategicInsights(),
    logAIAction: (data: any) => controller.logAIAction(data)
};
