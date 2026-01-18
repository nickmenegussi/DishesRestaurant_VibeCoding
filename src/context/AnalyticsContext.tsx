
import React, { createContext, useContext, useState, useCallback } from 'react';
import { analyticsService } from '../../backend';

interface AnalyticsContextType {
    orderReports: any;
    dishReports: any;
    aiPerformance: any;
    loading: boolean;
    error: string | null;
    fetchOrderReports: (startDate?: string, endDate?: string) => Promise<void>;
    fetchDishReports: () => Promise<void>;
    fetchAIPerformance: (startDate?: string, endDate?: string) => Promise<void>;
    logAIAction: (action: 'generated' | 'applied' | 'discarded', dishId?: string) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const [orderReports, setOrderReports] = useState<any>(null);
    const [dishReports, setDishReports] = useState<any>(null);
    const [aiPerformance, setAiPerformance] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderReports = useCallback(async (startDate?: string, endDate?: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await analyticsService.getOrders({ startDate, endDate });
            setOrderReports(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch order reports');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDishReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await analyticsService.getDishes();
            setDishReports(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dish reports');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAIPerformance = useCallback(async (startDate?: string, endDate?: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await analyticsService.getAIPerformance({ startDate, endDate });
            setAiPerformance(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch AI performance');
        } finally {
            setLoading(false);
        }
    }, []);

    const logAIAction = useCallback(async (action: 'generated' | 'applied' | 'discarded', dishId?: string) => {
        try {
            await analyticsService.logAIAction({ action, dishId });
        } catch (err) {
            console.error('Failed to log AI action:', err);
        }
    }, []);

    return (
        <AnalyticsContext.Provider value={{
            orderReports,
            dishReports,
            aiPerformance,
            loading,
            error,
            fetchOrderReports,
            fetchDishReports,
            fetchAIPerformance,
            logAIAction
        }}>
            {children}
        </AnalyticsContext.Provider>
    );
}

export function useAnalytics() {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
}
