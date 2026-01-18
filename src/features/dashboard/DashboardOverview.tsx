
import { useState, useEffect, useCallback } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Package,
  ArrowRight,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { dashboardService } from "../../../backend/index";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading && !stats) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const kpis = [
    { 
      label: "Total Revenue", 
      value: `$${stats?.summary.totalRevenue.toFixed(2)}`, 
      icon: DollarSign, 
      color: "text-emerald-600 bg-emerald-50",
      description: "Lifetime earnings" 
    },
    { 
      label: "Total Orders", 
      value: stats?.summary.totalOrders, 
      icon: ShoppingBag, 
      color: "text-primary bg-primary-light",
      description: "Volume across all status" 
    },
    { 
      label: "Pending Orders", 
      value: stats?.summary.statusDistribution.pending, 
      icon: Clock, 
      color: "text-amber-600 bg-amber-50",
      description: "Awaiting confirmation" 
    },
    { 
        label: "Completed", 
        value: stats?.summary.statusDistribution.completed, 
        icon: CheckCircle, 
        color: "text-blue-600 bg-blue-50",
        description: "Successfully delivered" 
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Business Insights</h1>
          <p className="text-text-muted mt-1 font-medium">Real-time performance metrics</p>
        </div>
        <Button variant="ghost" onClick={fetchStats} disabled={isLoading} className="hover:bg-primary/5">
          <RefreshCw className={cn("mr-2 h-4 w-4 text-primary", isLoading && "animate-spin")} />
          Sync Data
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="p-6 border-none shadow-card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-text-muted">{kpi.label}</p>
                <h3 className="text-3xl font-black text-text-main mt-1">{kpi.value}</h3>
              </div>
              <div className={cn("rounded-xl p-3", kpi.color)}>
                <kpi.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs font-semibold text-text-muted mt-4 flex items-center gap-1 opacity-70">
              <TrendingUp className="h-3 w-3" />
              {kpi.description}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Status Distribution Card */}
        <Card className="lg:col-span-1 p-8 border-none shadow-card">
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-primary" />
            Order Distribution
          </h3>
          <div className="space-y-6">
            {Object.entries(stats?.summary.statusDistribution || {}).map(([status, count]: [string, any]) => (
                <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="capitalize font-bold text-text-muted">{status}</span>
                        <span className="font-black text-text-main">{count}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={cn(
                                "h-full transition-all duration-1000",
                                status === 'pending' ? 'bg-amber-400' :
                                status === 'confirmed' ? 'bg-blue-400' :
                                status === 'completed' ? 'bg-emerald-400' :
                                'bg-rose-400'
                            )}
                            style={{ width: `${(count / (stats?.summary.totalOrders || 1)) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Card */}
        <Card className="lg:col-span-2 p-8 border-none shadow-card overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h3>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5">
                Full Pipeline <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-text-muted border-b border-gray-100">
                <tr>
                  <th className="pb-4 font-black">Order ID</th>
                  <th className="pb-4 font-black">Items</th>
                  <th className="pb-4 font-black">Amount</th>
                  <th className="pb-4 font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.recentOrders.map((order: any) => (
                  <tr key={order.id} className="group hover:bg-surface-muted/50 transition-colors">
                    <td className="py-4 font-bold text-primary/80">#{order.id.slice(0, 8)}</td>
                    <td className="py-4 text-text-muted truncate max-w-[200px]">
                      {order.order_items?.[0]?.dishes?.name} {order.order_items.length > 1 && `+${order.order_items.length - 1} more`}
                    </td>
                    <td className="py-4 font-black text-text-main">${order.total_price.toFixed(2)}</td>
                    <td className="py-4">
                        <Badge 
                            variant={
                                order.status === 'pending' ? 'warning' :
                                order.status === 'confirmed' ? 'secondary' :
                                order.status === 'completed' ? 'success' :
                                'outline'
                            }
                            className="capitalize"
                        >
                            {order.status}
                        </Badge>
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                    <tr>
                        <td colSpan={4} className="py-12 text-center text-text-muted font-medium italic">
                            No recent activity recorded.
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
