"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StageTimeline } from "./stage-timeline"
import { LiveLog } from "./live-log"
import { MetricsPanel } from "./metrics-panel"

interface Stage {
  id: string
  stageName: string
  stageOrder: number
  status: "pending" | "running" | "completed" | "failed"
  startedAt?: string | null
  endedAt?: string | null
  durationMs?: number | null
  inputTokens?: number | null
  outputTokens?: number | null
  costEstimate?: string | null
  promptUsed?: string | null
  responsePreview?: string | null
  metadata?: Record<string, unknown>
}

interface LogEntry {
  id: string
  timestamp: string
  agentName: string
  action: string
  level: "info" | "warning" | "error" | "success"
  details?: Record<string, unknown>
}

interface StoryStatus {
  storyId: string
  status: string
  progress: number
  progressMessage?: string
  generationMode?: string
  processingStartedAt?: string | null
  processingCompletedAt?: string | null
  errorMessage?: string | null
}

interface PipelineDashboardProps {
  storyId: string
}

export function PipelineDashboard({ storyId }: PipelineDashboardProps) {
  const [status, setStatus] = useState<StoryStatus | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectSSE = useCallback(() => {
    const eventSource = new EventSource(`/api/stories/${storyId}/stream`)

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.addEventListener("status", (event) => {
      try {
        const data = JSON.parse(event.data)
        setStatus(data)
      } catch (e) {
        console.error("[SSE] Failed to parse status:", e)
      }
    })

    eventSource.addEventListener("stages", (event) => {
      try {
        const data = JSON.parse(event.data)
        setStages(data)
      } catch (e) {
        console.error("[SSE] Failed to parse stages:", e)
      }
    })

    eventSource.addEventListener("logs", (event) => {
      try {
        const data = JSON.parse(event.data)
        setLogs(data)
      } catch (e) {
        console.error("[SSE] Failed to parse logs:", e)
      }
    })

    eventSource.addEventListener("complete", (event) => {
      try {
        const data = JSON.parse(event.data)
        setStatus((prev) => prev ? { ...prev, status: data.status } : null)
      } catch (e) {
        console.error("[SSE] Failed to parse complete:", e)
      }
      eventSource.close()
      setIsConnected(false)
    })

    eventSource.addEventListener("error", (event) => {
      if (event instanceof MessageEvent) {
        try {
          const data = JSON.parse(event.data)
          setError(data.message || "Connection error")
        } catch {
          setError("Connection error")
        }
      }
    })

    eventSource.onerror = () => {
      setIsConnected(false)
      eventSource.close()
    }

    return eventSource
  }, [storyId])

  useEffect(() => {
    const eventSource = connectSSE()
    return () => {
      eventSource.close()
    }
  }, [connectSSE])

  const totalInputTokens = stages.reduce((sum, s) => sum + (s.inputTokens || 0), 0)
  const totalOutputTokens = stages.reduce((sum, s) => sum + (s.outputTokens || 0), 0)
  const totalCost = stages.reduce((sum, s) => {
    const cost = parseFloat(s.costEstimate || "0")
    return sum + (isNaN(cost) ? 0 : cost)
  }, 0)
  const totalDuration = stages.reduce((sum, s) => sum + (s.durationMs || 0), 0)

  const currentStage = stages.find((s) => s.status === "running")
  const isComplete = status?.status === "completed"
  const isFailed = status?.status === "failed"

  const getStatusBadge = () => {
    if (isFailed) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Failed
        </Badge>
      )
    }
    if (isComplete) {
      return (
        <Badge className="gap-1 bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle2 className="h-3 w-3" />
          Complete
        </Badge>
      )
    }
    if (isConnected) {
      return (
        <Badge variant="secondary" className="gap-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Processing
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connecting...
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Pipeline Progress</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {status?.progressMessage || "Initializing..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {!isConnected && !isComplete && !isFailed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => connectSSE()}
                  className="gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reconnect
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{status?.progress || 0}%</span>
            </div>
            <Progress value={status?.progress || 0} className="h-2" />
          </div>

          <StageTimeline
            stages={stages.map((s) => ({
              stageName: s.stageName,
              status: s.status,
              durationMs: s.durationMs,
              stageOrder: s.stageOrder,
            }))}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-3"
            >
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Error</span>
              </div>
              <p className="mt-1 text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          {currentStage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-primary/30 bg-primary/5 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium text-primary">
                  Currently Running: {currentStage.stageName}
                </span>
              </div>
              {currentStage.responsePreview && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {currentStage.responsePreview}
                </p>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      <MetricsPanel
        inputTokens={totalInputTokens}
        outputTokens={totalOutputTokens}
        costEstimate={totalCost.toFixed(4)}
        durationMs={totalDuration}
      />

      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span>Live Logs</span>
            <Badge variant="secondary" className="text-xs">
              {logs.length} events
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <LiveLog logs={logs} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
