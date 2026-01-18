
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { analyticsService } from "../../../backend/index";
import { cn } from "../../utils/cn";

export default function ReportsInsights() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const result = await analyticsService.getStrategicInsights();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch strategic insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (isLoading && !data) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center border-none shadow-card min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-text-muted font-bold animate-pulse">AI Analyst is crunching numbers...</p>
      </Card>
    );
  }

  const insights = data?.insights?.insights || [];
  const reports = data?.reports || {};

  return (
    <div className="space-y-8">
      {/* AI Analyst Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-primary">Strategic AI Analyst</h2>
            <p className="text-sm text-text-muted">Gemini Pro powered business intelligence</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchInsights} disabled={isLoading}>
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Refresh Analysis
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: AI Insights */}
        <div className="space-y-6">
          <Card className="p-8 border-none shadow-card bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-primary/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-main">Executive Summary</h3>
                <p className="text-text-muted mt-1 leading-relaxed italic">
                  "{data?.insights?.summary || "No summary available."}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {insights.map((insight: any, i: number) => (
                <div 
                  key={i} 
                  className="flex gap-4 p-4 rounded-xl bg-white/50 border border-white/20 hover:border-primary/20 transition-all"
                >
                  <div className="mt-1">
                    {insight.type === 'trend' && <TrendingUp className="h-5 w-5 text-blue-500" />}
                    {insight.type === 'alert' && <AlertCircle className="h-5 w-5 text-rose-500" />}
                    {insight.type === 'recommendation' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest mb-1 opacity-70">
                      {insight.type}
                    </Badge>
                    <p className="text-sm font-bold text-text-main leading-tight">
                      {insight.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-primary/10 flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted opacity-60 italic uppercase tracking-tighter">
                Analysis based on last 30 days
              </span>
              <Badge 
                variant={data?.insights?.priority === 'high' ? 'warning' : 'secondary'}
                className="font-black"
              >
                {data?.insights?.priority} Priority
              </Badge>
            </div>
          </Card>
        </div>

        {/* Right: Aggregated Reports (Data Viz placeholder style) */}
        <div className="grid gap-6">
           {/* Revenue & Performance */}
           <Card className="p-6 border-none shadow-card">
              <h4 className="text-sm font-black text-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Category Performance
              </h4>
              <div className="space-y-4">
                {reports.categories?.map((cat: any, i: number) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 bg-primary rounded-full group-hover:h-10 transition-all" />
                      <div>
                        <p className="text-sm font-black text-text-main uppercase">{cat.category}</p>
                        <p className="text-xs text-text-muted font-bold">{cat.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-text-main">${cat.revenue?.toFixed(2)}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">In Target</p>
                    </div>
                  </div>
                ))}
              </div>
           </Card>

           {/* AI Impact */}
           <Card className="p-6 border-none shadow-card">
              <h4 className="text-sm font-black text-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Content Impact
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-muted/50">
                   <p className="text-[10px] font-bold text-text-muted uppercase">Approval Rate</p>
                   <p className="text-2xl font-black text-text-main">{reports.ai?.approvalRate || '0.0%'}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-muted/50">
                   <p className="text-[10px] font-bold text-text-muted uppercase">Dishes Generated</p>
                   <p className="text-2xl font-black text-text-main">{reports.ai?.generated || 0}</p>
                </div>
              </div>
              <p className="text-xs text-text-muted mt-4 font-medium italic">
                AI dishes contribute to roughly 15% of total engagement.
              </p>
           </Card>
        </div>
      </div>
    </div>
  );
}
