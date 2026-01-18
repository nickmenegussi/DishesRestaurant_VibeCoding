import { useState, useEffect, useCallback } from "react";
import { 
  ShoppingBag, 
  Loader2, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Calendar,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import { orderService } from "../../../backend/index";
import { cn } from "../../utils/cn";

export default function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.listOrders();
      setOrders(data || []);
    } catch (err: any) {
      console.error("[OrderList] Fetch error:", err);
      setError(err.message || "Failed to load orders");
      addToast("Error fetching orders. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      addToast(`Order successfully ${newStatus}`, "success");
    } catch (err: any) {
      console.error("[OrderList] Update error:", err);
      addToast(err.message || "Failed to update order status", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    pending: { icon: Clock, color: 'text-amber-500 bg-amber-50 border-amber-100', label: 'Pending' },
    confirmed: { icon: Package, color: 'text-blue-500 bg-blue-50 border-blue-100', label: 'Confirmed' },
    completed: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 border-emerald-100', label: 'Completed' },
    canceled: { icon: XCircle, color: 'text-rose-500 bg-rose-50 border-rose-100', label: 'Canceled' },
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-text-muted animate-pulse">Loading orders...</p>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-rose-50 p-4">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-main">Connection Error</h3>
          <p className="max-w-xs text-sm text-text-muted">{error}</p>
        </div>
        <Button onClick={fetchOrders} variant="secondary">Retry Connection</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-8 font-sans">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Orders Pipeline</h1>
          <p className="text-text-muted font-medium">Manage restaurant workflow and fulfillment</p>
        </div>
        <Button variant="ghost" onClick={fetchOrders} disabled={isLoading} className="hover:bg-primary/5">
          <RefreshCw className={cn("mr-2 h-4 w-4 text-primary", isLoading && "animate-spin")} />
          Sync Data
        </Button>
      </header>

      {orders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed border-2">
          <div className="rounded-full bg-surface-muted p-6 mb-4">
            <ShoppingBag className="h-10 w-10 text-text-muted/20" />
          </div>
          <h3 className="text-xl font-bold text-text-main">No active orders</h3>
          <p className="text-text-muted mt-2 max-w-xs">New orders will materialize here once customers complete the checkout.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <Card key={order.id} className="group relative overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
                {/* Status Indicator Bar */}
                <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", config.color.split(' ')[1])} />
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 p-6">
                  {/* Left Info: ID, Status, Date */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-black uppercase tracking-wider text-primary/60">
                         #{order.id.slice(0, 8)}
                      </span>
                      <div className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-tight", config.color)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="mx-1 opacity-20">|</span>
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="inline-flex items-center gap-2 rounded-lg bg-surface-muted px-2.5 py-1.5 border border-gray-100">
                          <span className="text-xs font-bold text-primary">{item.quantity}x</span>
                          <span className="text-xs font-semibold text-text-main">{item.dishes?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Middle Info: Price */}
                  <div className="flex flex-col items-start lg:items-end min-w-[120px]">
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1">
                      Total Revenue
                    </span>
                    <div className="flex items-center text-2xl font-black text-text-main">
                      <DollarSign className="h-5 w-5 text-primary" />
                      {order.total_price.toFixed(2)}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t lg:pt-0 lg:border-t-0">
                    {order.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                        disabled={isUpdating === order.id}
                        className="bg-primary hover:bg-primary-hover font-bold"
                      >
                         {isUpdating === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Order"}
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        disabled={isUpdating === order.id}
                        className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                      >
                         {isUpdating === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Completed"}
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleUpdateStatus(order.id, 'canceled')}
                        disabled={isUpdating === order.id}
                        className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold"
                      >
                         Cancel
                      </Button>
                    )}
                    {(order.status === 'completed' || order.status === 'canceled') && (
                      <span className="text-xs font-bold text-text-muted italic px-4">
                        Order processed
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
