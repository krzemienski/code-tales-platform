"use client"

import { useMemo } from "react"
import { Clock, DollarSign, FileText, Sparkles, Cpu, Volume2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { estimateGeneration, type EstimationResult } from "@/lib/content-generation/estimation"

interface GenerationEstimateProps {
  targetDurationMinutes: number
  expertiseLevel: "beginner" | "intermediate" | "expert"
  repoSizeEstimate?: "small" | "medium" | "large"
}

export function GenerationEstimate({
  targetDurationMinutes,
  expertiseLevel,
  repoSizeEstimate = "medium",
}: GenerationEstimateProps) {
  const estimate: EstimationResult = useMemo(
    () =>
      estimateGeneration({
        targetDurationMinutes,
        expertiseLevel,
        repoSizeEstimate,
      }),
    [targetDurationMinutes, expertiseLevel, repoSizeEstimate],
  )

  const formatCost = (cost: number) => {
    if (cost < 0.01) return "<$0.01"
    return `$${cost.toFixed(2)}`
  }

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `~${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Generation Estimate</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">Time to Generate</span>
            </div>
            <p className="font-semibold text-lg">{formatMinutes(estimate.estimatedMinutes)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span className="text-xs">Word Count</span>
            </div>
            <p className="font-semibold text-lg">{estimate.wordCount.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="text-xs">Est. Cost</span>
            </div>
            <p className="font-semibold text-lg text-primary">{formatCost(estimate.estimatedCost.total)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-xs">Cost Breakdown</span>
            </div>
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                <span>AI: {formatCost(estimate.estimatedCost.ai)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                <span>TTS: {formatCost(estimate.estimatedCost.tts)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
