"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Search,
  BookOpen,
  FileCode,
  Mic,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react"

interface Stage {
  stageName: string
  status: "pending" | "running" | "completed" | "failed"
  durationMs?: number | null
  stageOrder: number
}

interface StageTimelineProps {
  stages: Stage[]
}

const STAGE_CONFIG: Record<string, { icon: typeof Search; label: string }> = {
  analyzer: { icon: Search, label: "Analyzer" },
  narrator: { icon: BookOpen, label: "Narrator" },
  parser: { icon: FileCode, label: "Parser" },
  synthesizer: { icon: Mic, label: "Synthesizer" },
  complete: { icon: CheckCircle, label: "Complete" },
}

const STATUS_CONFIG = {
  pending: {
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
    borderColor: "border-muted",
    icon: Clock,
  },
  running: {
    bgColor: "bg-primary/20",
    textColor: "text-primary",
    borderColor: "border-primary",
    icon: Loader2,
  },
  completed: {
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    borderColor: "border-green-500",
    icon: CheckCircle,
  },
  failed: {
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500",
    icon: AlertCircle,
  },
}

const DEFAULT_STAGES: Stage[] = [
  { stageName: "analyzer", status: "pending", stageOrder: 1 },
  { stageName: "narrator", status: "pending", stageOrder: 2 },
  { stageName: "parser", status: "pending", stageOrder: 3 },
  { stageName: "synthesizer", status: "pending", stageOrder: 4 },
  { stageName: "complete", status: "pending", stageOrder: 5 },
]

function formatDuration(ms: number | null | undefined): string {
  if (!ms) return "--"
  if (ms < 1000) return `${ms}ms`
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export function StageTimeline({ stages }: StageTimelineProps) {
  const displayStages = stages.length > 0 ? stages : DEFAULT_STAGES

  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto py-4">
      {displayStages.map((stage, index) => {
        const stageKey = stage.stageName.toLowerCase()
        const config = STAGE_CONFIG[stageKey] || { icon: Clock, label: stage.stageName }
        const statusConfig = STATUS_CONFIG[stage.status] || STATUS_CONFIG.pending
        const StageIcon = config.icon
        const StatusIcon = statusConfig.icon
        const isLast = index === displayStages.length - 1

        return (
          <div key={stage.stageOrder} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                  statusConfig.bgColor,
                  statusConfig.borderColor
                )}
              >
                {stage.status === "running" ? (
                  <Loader2 className={cn("h-5 w-5 animate-spin", statusConfig.textColor)} />
                ) : (
                  <StageIcon className={cn("h-5 w-5", statusConfig.textColor)} />
                )}
                {stage.status === "completed" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1"
                  >
                    <CheckCircle className="h-4 w-4 fill-green-500 text-background" />
                  </motion.div>
                )}
                {stage.status === "failed" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1"
                  >
                    <AlertCircle className="h-4 w-4 fill-red-500 text-background" />
                  </motion.div>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium whitespace-nowrap",
                  statusConfig.textColor
                )}
              >
                {config.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatDuration(stage.durationMs)}
              </span>
            </motion.div>
            {!isLast && (
              <div className="mx-2 flex-shrink-0">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.05 }}
                  className={cn(
                    "h-0.5 w-8 origin-left",
                    stage.status === "completed" ? "bg-green-500" : "bg-muted"
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
