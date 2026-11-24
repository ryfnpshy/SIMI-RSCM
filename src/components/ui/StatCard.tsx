import { Card, CardContent } from "./Card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "increase" | "decrease" | "neutral" | "warning"
  icon: LucideIcon
  iconColor?: string
  trend?: "up" | "down" | "neutral"
}

export function StatCard({ title, value, change, changeType, icon: Icon, iconColor = "teal", trend = "neutral" }: StatCardProps) {
  const iconColors = {
    teal: "bg-primary/10 text-primary ring-primary/15",
    blue: "bg-secondary/10 text-secondary ring-secondary/15",
    emerald: "bg-primary/10 text-primary ring-primary/15",
    amber: "bg-tertiary-fixed/40 text-tertiary ring-tertiary/20",
    red: "bg-error-container text-on-error-container ring-error/20",
    purple: "bg-secondary/10 text-secondary ring-secondary/15",
  }

  const changeColors = {
    increase: "text-primary",
    decrease: "text-error",
    neutral: "text-on-surface-variant",
    warning: "text-tertiary",
  }

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <Icon
          className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-primary/[0.055]"
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">{title}</p>
            <p className="mt-2 font-headline-xl text-headline-xl leading-none tabular-nums text-on-surface">{value}</p>
            {change && (
              <p className={cn("mt-2 font-label-md text-label-md", changeColors[changeType || "neutral"])}>
                {trend === "up" && "↑ "}
                {trend === "down" && "↓ "}
                {change}
              </p>
            )}
          </div>
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset", iconColors[iconColor as keyof typeof iconColors] || iconColors.teal)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}