"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Coins, Clock, Zap, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricsPanelProps {
  inputTokens?: number | null
  outputTokens?: number | null
  costEstimate?: string | null
  durationMs?: number | null
}

function formatTokens(tokens: number | null | undefined): string {
  if (!tokens) return "0"
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`
  }
  return tokens.toString()
}

function formatDuration(ms: number | null | undefined): string {
  if (!ms) return "0s"
  if (ms < 1000) return `${ms}ms`
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

function formatCost(cost: string | null | undefined): string {
  if (!cost) return "$0.00"
  const numCost = parseFloat(cost)
  if (isNaN(numCost)) return cost
  return `$${numCost.toFixed(4)}`
}

export function MetricsPanel({
  inputTokens,
  outputTokens,
  costEstimate,
  durationMs,
}: MetricsPanelProps) {
  const totalTokens = (inputTokens || 0) + (outputTokens || 0)

  const metrics = [
    {
      label: "Input Tokens",
      value: formatTokens(inputTokens),
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Output Tokens",
      value: formatTokens(outputTokens),
      icon: Zap,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Total Tokens",
      value: formatTokens(totalTokens),
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Est. Cost",
      value: formatCost(costEstimate),
      icon: Coins,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      label: "Duration",
      value: formatDuration(durationMs),
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className={cn("rounded-md p-1.5", metric.bgColor)}>
                    <Icon className={cn("h-3.5 w-3.5", metric.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground truncate">
                      {metric.label}
                    </p>
                    <p className={cn("text-sm font-semibold", metric.color)}>
                      {metric.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
