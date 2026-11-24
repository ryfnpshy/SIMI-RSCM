import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "secondary"
  size?: "default" | "sm" | "lg"
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center font-label-md rounded-full ring-1 ring-inset ring-current/15"

    const variants = {
      default: "bg-surface-container-high text-on-surface-variant",
      success: "bg-primary/10 text-primary",
      warning: "bg-tertiary-fixed text-tertiary",
      destructive: "bg-error-container text-on-error-container",
      info: "bg-secondary-fixed text-secondary",
      secondary: "bg-surface-container text-on-surface-variant",
    }

    const sizes = {
      default: "px-2.5 py-0.5 text-label-md",
      sm: "px-2 py-0.5 text-badge-sm",
      lg: "px-3 py-1 text-label-lg",
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

export { Badge }