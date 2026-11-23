import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-lg font-label-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]"

    const variants = {
      default: "bg-primary text-on-primary hover:bg-primary-container shadow-md",
      destructive: "bg-error text-on-error hover:bg-error/90 shadow-md",
      outline:
        "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low hover:border-outline",
      secondary: "bg-surface-container text-on-surface hover:bg-surface-container-high",
      ghost: "text-on-surface hover:bg-surface-container",
      link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-10 px-4 text-label-lg",
      sm: "h-8 rounded-md px-3 text-label-md",
      lg: "h-11 px-6 text-body-md",
      icon: "h-10 w-10",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }