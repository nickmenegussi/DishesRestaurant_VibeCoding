import { useEffect, useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie
} from 'recharts';
import { 
    TrendingUp, Menu, 
    Download, CheckCircle2,
    Package,
    RefreshCw, Sparkles, Clock, Layers
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import ReportsInsights from '../dashboard/ReportsInsights';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];

interface OrderReport {
    summary: {
        totalRevenue: number;
        totalOrders: number;
        avgTicket: number;
    };
    trends: Array<{ date: string; revenue: number }>;
    categoryPerformance: Array<{ category: string; revenue: number }>;
}

interface DishReport {
    summary: {
        totalDishes: number;
        activeDishes: number;
        archivedDishes: number;
    };
    categoryDistribution: Array<{ name: string; value: number }>;
}

interface AIPerformanceReport {
    summary: {
        generated: number;
        applied: number;
        discarded: number;
        approvalRate: string;
    };
    logs: Array<{
        id: string;
        action: string;
        created_at: string;
        dish_id: string | null;
    }>;
}

export default function AnalyticsDashboard() {
    const { 
        orderReports, dishReports, aiPerformance, 
        loading, error, fetchOrderReports, fetchDishReports, fetchAIPerformance 
    } = useAnalytics();
    
    const [activeTab, setActiveTab] = useState<'orders' | 'dishes' | 'ai' | 'insights'>('orders');

    useEffect(() => {
        fetchOrderReports();
        fetchDishReports();
        fetchAIPerformance();
    }, [fetchOrderReports, fetchDishReports, fetchAIPerformance]);

    const handleRefresh = () => {
        if (activeTab === 'orders') fetchOrderReports();
        if (activeTab === 'dishes') fetchDishReports();
        if (activeTab === 'ai') fetchAIPerformance();
    };

    if (error) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center p-8">
                <div className="rounded-full bg-red-100 p-4 text-red-600">
                    <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-bold">Failed to load analytics</h3>
                <p className="mt-2 text-text-muted">{error}</p>
                <Button onClick={handleRefresh} className="mt-6">Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-main">Reports & Analytics</h1>
                    <p className="text-text-muted">Strategic insights into your restaurant performance and AI operations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="gap-2" onClick={handleRefresh} disabled={loading}>
                        <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                        Refresh
                    </Button>
                    <Button variant="primary" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            <div className="flex border-b border-gray-100 overflow-x-auto custom-scrollbar">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-4 text-sm font-bold transition-all ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-main'}`}
                >
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Order Analysis
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('dishes')}
                    className={`px-6 py-4 text-sm font-bold transition-all ${activeTab === 'dishes' ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-main'}`}
                >
                    <div className="flex items-center gap-2">
                        <Menu className="h-4 w-4" />
                        Dish Performance
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('ai')}
                    className={`px-6 py-4 text-sm font-bold transition-all ${activeTab === 'ai' ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-main'}`}
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Performance
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('insights')}
                    className={`px-6 py-4 text-sm font-bold transition-all ${activeTab === 'insights' ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-main'}`}
                >
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Strategic Insights
                    </div>
                </button>
            </div>

            <div className="space-y-8">
                {activeTab === 'orders' && orderReports && (
                    <OrderAnalysis reports={orderReports as unknown as OrderReport} />
                )}
                {activeTab === 'dishes' && dishReports && (
                    <DishPerformance reports={dishReports as unknown as DishReport} />
                )}
                {activeTab === 'ai' && aiPerformance && (
                    <AIPerformance reports={aiPerformance as unknown as AIPerformanceReport} />
                )}
                {activeTab === 'insights' && (
                    <ReportsInsights />
                )}
            </div>
        </div>
    );
}

function OrderAnalysis({ reports }: { reports: OrderReport }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Revenue" 
                    value={`$${reports.summary.totalRevenue.toLocaleString()}`} 
                    icon={TrendingUp}
                    trend={{ value: 12, isPositive: true }}
                    description="vs last month"
                />
                <StatCard 
                    title="Total Orders" 
                    value={reports.summary.totalOrders} 
                    icon={Package}
                    trend={{ value: 8, isPositive: true }}
                    description="vs last month"
                />
                <StatCard 
                    title="Avg. Ticket" 
                    value={`$${reports.summary.avgTicket.toFixed(2)}`} 
                    icon={Package}
                />
                <StatCard 
                    title="Completion Rate" 
                    value="94%" 
                    icon={Layers}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6">Revenue & Order Trends</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports.trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#FF6B6B" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6">Revenue by Category</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports.categoryPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="category" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                                    {reports.categoryPerformance.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function DishPerformance({ reports }: { reports: DishReport }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Total Menu Items" 
                    value={reports.summary.totalDishes} 
                    icon={Menu}
                />
                <StatCard 
                    title="Active Dishes" 
                    value={reports.summary.activeDishes} 
                    icon={Layers}
                    className="bg-emerald-50/30"
                />
                <StatCard 
                    title="Archived" 
                    value={reports.summary.archivedDishes} 
                    icon={RefreshCw}
                    className="bg-amber-50/30"
                />
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-bold mb-6">Dish Distribution by Category</h3>
                <div className="flex flex-col md:flex-row items-center justify-around h-[400px]">
                    <div className="w-full h-full md:w-1/2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reports.categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {reports.categoryDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/3 space-y-3">
                        {reports.categoryDistribution.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-sm font-medium text-text-main">{entry.name}</span>
                                </div>
                                <span className="text-sm font-bold text-text-muted">{entry.value} dishes</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

function AIPerformance({ reports }: { reports: AIPerformanceReport }) {
    // Mock timeline data based on logs for better visualization
    const timelineData = reports.logs.slice(0, 7).map((log) => ({
        name: new Date(log.created_at).toLocaleDateString(undefined, { weekday: 'short' }),
        generated: reports.logs.filter(l => new Date(l.created_at).toDateString() === new Date(log.created_at).toDateString()).length,
        applied: reports.logs.filter(l => l.action === 'applied' && new Date(l.created_at).toDateString() === new Date(log.created_at).toDateString()).length
    })).reverse();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* AI Summary Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Engines Fired" 
                    value={reports.summary.generated} 
                    icon={Sparkles}
                    className="border-indigo-100 bg-indigo-50/20"
                />
                <StatCard 
                    title="Menu Integration" 
                    value={reports.summary.applied} 
                    icon={CheckCircle2}
                    className="border-emerald-100 bg-emerald-50/20"
                />
                <StatCard 
                    title="Optimization Noise" 
                    value={reports.summary.discarded} 
                    icon={RefreshCw}
                    className="border-amber-100 bg-amber-50/20"
                />
                <StatCard 
                    title="Precision Rate" 
                    value={reports.summary.approvalRate} 
                    icon={TrendingUp}
                    className="border-purple-100 bg-purple-50/20"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* AI Efficiency Chart */}
                <Card className="p-6 lg:col-span-2 shadow-sm border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-text-main flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-500" />
                                Model Efficiency Timeline
                            </h3>
                            <p className="text-xs text-text-muted mt-1">Activity and conversion tracking for the last 7 cycles</p>
                        </div>
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">Pro Active</Badge>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#F9FAFB'}} 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                                />
                                <Bar dataKey="generated" name="Total Syncs" fill="#818CF8" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="applied" name="Conversions" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* AI Impact Stats */}
                <Card className="p-6 lg:col-span-1 shadow-sm border-gray-100 bg-gradient-to-br from-white to-indigo-50/30">
                    <h3 className="text-lg font-black text-text-main mb-6">Strategic Value</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Time Optimized</p>
                                <p className="text-lg font-black text-text-main">~42 Hours</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Content Coverage</p>
                                <p className="text-lg font-black text-text-main">28% Automated</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-text-muted">Conversion Precision</span>
                                <span className="text-xs font-black text-emerald-600">{reports.summary.approvalRate}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                                    style={{ width: reports.summary.approvalRate }}
                                />
                            </div>
                            <p className="text-[10px] text-text-muted mt-3 italic">
                                Optimized by Gemini 1.5 Pro to reduce manual editing time.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Activity Feed */}
                <Card className="p-6 lg:col-span-3 overflow-hidden shadow-sm border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-text-main">Intelligence Feed</h3>
                            <p className="text-xs text-text-muted">Real-time trace of AI decision making processes</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50">
                            View Deep Logs
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-text-muted">
                                    <th className="pb-4 pr-4 font-black uppercase tracking-wider text-[10px]">Operation</th>
                                    <th className="pb-4 pr-4 font-black uppercase tracking-wider text-[10px]">Registry Date</th>
                                    <th className="pb-4 pr-4 font-black uppercase tracking-wider text-[10px]">Resource ID</th>
                                    <th className="pb-4 font-black uppercase tracking-wider text-[10px]">Logic Patch</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reports.logs.length > 0 ? reports.logs.map((log) => (
                                    <tr key={log.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pr-4">
                                            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-tighter ${
                                                log.action === 'applied' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                                                log.action === 'discarded' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                                                'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                            }`}>
                                                {log.action.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 text-text-muted font-medium">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-4 pr-4 font-mono text-xs text-indigo-500/70">
                                            {log.dish_id ? log.dish_id.slice(0, 12) : 'N/A'}
                                        </td>
                                        <td className="py-4 text-text-main font-bold">
                                            {log.action === 'applied' ? 'Full integration applied to menu production' : 
                                             log.action === 'discarded' ? 'Discarded by administrative review' : 
                                             'Generated by Gemini Intelligence Engine'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-text-muted italic shadow-inner bg-gray-50/30 rounded-2xl">
                                            No intelligence activity recorded in current scope.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
