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
    teal: "bg-primary/10 text-primary",
    blue: "bg-secondary/10 text-secondary",
    emerald: "bg-primary/10 text-primary",
    amber: "bg-tertiary-fixed/40 text-tertiary",
    red: "bg-error-container text-on-error-container",
    purple: "bg-secondary/10 text-secondary",
  }

  const changeColors = {
    increase: "text-primary",
    decrease: "text-error",
    neutral: "text-on-surface-variant",
    warning: "text-tertiary",
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md uppercase tracking-wide text-on-surface-variant">{title}</p>
            <p className="mt-1 font-headline-xl text-headline-xl text-on-surface">{value}</p>
            {change && (
              <p className={cn("mt-1 font-label-md text-label-md", changeColors[changeType || "neutral"])}>
                {trend === "up" && "↑ "}
                {trend === "down" && "↓ "}
                {change}
              </p>
            )}
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconColors[iconColor as keyof typeof iconColors] || iconColors.teal)}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}