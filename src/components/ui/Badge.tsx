import * as React from "react"
import { cn } from "../../utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'success' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      {
        'border-transparent bg-primary text-white hover:bg-primary/80': variant === 'default',
        'border-gray-200 text-text-main': variant === 'outline',
        'border-transparent bg-gray-100 text-text-main hover:bg-gray-200': variant === 'secondary',
        'border-transparent bg-green-100 text-green-700 hover:bg-green-200': variant === 'success',
        'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200': variant === 'warning',
      },
      className
    )} {...props} />
  )
}

export { Badge }
