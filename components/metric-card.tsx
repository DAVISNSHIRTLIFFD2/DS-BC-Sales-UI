import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon?: ReactNode
}

export function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div className="mt-2">
          <p className="text-3xl font-bold">{value}</p>
          <div className="mt-1 flex items-center">
            {trend === "up" ? (
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
            ) : trend === "down" ? (
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
            ) : null}
            <p className={`text-sm ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : ""}`}>
              {change} from last month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
