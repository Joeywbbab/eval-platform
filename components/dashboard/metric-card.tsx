"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  trend?: {
    value: string
    direction: "up" | "down"
    label: string
  }
  icon?: LucideIcon
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
}: MetricCardProps) {
  const TrendIcon = trend?.direction === "up" ? TrendingUp : TrendingDown
  const trendColor = trend?.direction === "up" ? "text-green-500" : "text-red-500"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendIcon className={`h-3 w-3 ${trendColor}`} />
            <span className={trendColor}>{trend.value}</span> {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
})
