import * as React from "react"
import { cn } from "../../utils/cn"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-gray-100 bg-white text-text-main shadow-card",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }
