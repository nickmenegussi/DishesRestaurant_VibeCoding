import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
    className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, description, className }: StatCardProps) {
    return (
        <Card className={cn("p-6", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-text-muted">{title}</p>
                    <h3 className="mt-1 text-2xl font-bold text-text-main">{value}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            {(trend || description) && (
                <div className="mt-4 flex items-center gap-2">
                    {trend && (
                        <span className={cn(
                            "flex items-center text-sm font-bold",
                            trend.isPositive ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {trend.isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                            {trend.value}%
                        </span>
                    )}
                    {description && (
                        <span className="text-xs text-text-muted">{description}</span>
                    )}
                </div>
            )}
        </Card>
    );
}
