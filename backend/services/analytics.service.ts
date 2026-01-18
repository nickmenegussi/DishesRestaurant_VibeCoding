
import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
    private analyticsRepository: AnalyticsRepository;

    constructor() {
        this.analyticsRepository = new AnalyticsRepository();
    }

    async getOrderReports(startDate: string, endDate: string) {
        const orders = await this.analyticsRepository.getOrderStats(startDate, endDate);
        const orderItems = await this.analyticsRepository.getOrderItemsWithDishes(startDate, endDate);

        // Group by day for trends
        const dailyTrends = orders.reduce((acc: any, order) => {
            const date = new Date(order.created_at).toISOString().split('T')[0];
            if (!acc[date]) acc[date] = { date, count: 0, revenue: 0 };
            acc[date].count += 1;
            acc[date].revenue += Number(order.total_price);
            return acc;
        }, {});

        // Status Distribution
        const statusDistribution = orders.reduce((acc: any, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        // Category Distribution
        const categoryPerformance = orderItems.reduce((acc: any, item: any) => {
            const cat = item.dishes?.category || 'Uncategorized';
            if (!acc[cat]) acc[cat] = { category: cat, revenue: 0, orders: 0 };
            acc[cat].revenue += Number(item.unit_price) * item.quantity;
            acc[cat].orders += item.quantity;
            return acc;
        }, {});

        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price), 0);
        const totalOrders = orders.length;

        return {
            summary: {
                totalOrders,
                totalRevenue,
                avgTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0
            },
            trends: Object.values(dailyTrends),
            statusDistribution: Object.entries(statusDistribution).map(([name, value]) => ({ name, value })),
            categoryPerformance: Object.values(categoryPerformance)
        };
    }

    async getDishReports() {
        const dishes = await this.analyticsRepository.getDishStats();

        const totalDishes = dishes.length;
        const activeDishes = dishes.filter(d => d.active).length;
        const archivedDishes = totalDishes - activeDishes;

        const categoryDist = dishes.reduce((acc: any, dish) => {
            acc[dish.category] = (acc[dish.category] || 0) + 1;
            return acc;
        }, {});

        return {
            summary: {
                totalDishes,
                activeDishes,
                archivedDishes
            },
            categoryDistribution: Object.entries(categoryDist).map(([name, value]) => ({ name, value }))
        };
    }

    async getAIPerformance(startDate: string, endDate: string) {
        const logs = await this.analyticsRepository.getAILogs(startDate, endDate);

        const stats = logs.reduce((acc: any, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, { generated: 0, applied: 0, discarded: 0 });

        const approvalRate = stats.generated > 0 ? (stats.applied / stats.generated) * 100 : 0;

        return {
            summary: {
                ...stats,
                approvalRate: approvalRate.toFixed(1) + '%'
            },
            logs: logs.slice(0, 50) // Return last 50 logs
        };
    }

    async logAIAction(action: 'generated' | 'applied' | 'discarded', dishId?: string) {
        return this.analyticsRepository.logAIAction(action, dishId);
    }

    async getStrategicInsights() {
        // 1. Get raw strategic data (aggregated by repository or fetched for manual aggregation)
        const data = await this.analyticsRepository.getStrategicData();

        // 2. We use our existing data (order reports, dish reports, ai performance)
        // to build a comprehensive context for Gemini.
        // For simplicity, we'll fetch some defaults if data is fallback
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString();
        const today = new Date().toISOString();

        const [orderReports, dishReports, aiPerformance] = await Promise.all([
            this.getOrderReports(thirtyDaysAgo, today),
            this.getDishReports(),
            this.getAIPerformance(thirtyDaysAgo, today)
        ]);

        const fullStrategicContext = {
            revenue: orderReports.summary,
            categories: orderReports.categoryPerformance,
            dishes: dishReports.summary,
            ai: aiPerformance.summary,
            rawExtra: data
        };

        // 3. Call AI Service
        const { AIService } = await import('./ai.service');
        const ai = new AIService();
        const insights = await ai.analyzeStrategicData(fullStrategicContext);

        return {
            reports: fullStrategicContext,
            insights: insights
        };
    }
}
