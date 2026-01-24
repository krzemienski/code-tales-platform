"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  BookOpen,
  FileCode,
  Mic,
  Cpu,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Filter,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LogEntry {
  id?: string
  timestamp: string
  agentName: string
  action: string
  level: "info" | "warning" | "error" | "success"
  details?: Record<string, unknown>
}

interface LiveLogProps {
  logs: LogEntry[]
}

const AGENT_CONFIG: Record<string, { icon: typeof Cpu; color: string; bgColor: string }> = {
  Analyzer: { icon: Search, color: "text-blue-400", bgColor: "bg-blue-400/10" },
  Narrator: { icon: BookOpen, color: "text-green-400", bgColor: "bg-green-400/10" },
  Parser: { icon: FileCode, color: "text-purple-400", bgColor: "bg-purple-400/10" },
  Synthesizer: { icon: Mic, color: "text-orange-400", bgColor: "bg-orange-400/10" },
  System: { icon: Cpu, color: "text-gray-400", bgColor: "bg-gray-400/10" },
}

const LEVEL_CONFIG = {
  info: { icon: Info, color: "text-muted-foreground", bgColor: "bg-muted/50" },
  warning: { icon: AlertTriangle, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
  error: { icon: AlertCircle, color: "text-red-400", bgColor: "bg-red-400/10" },
  success: { icon: CheckCircle2, color: "text-green-400", bgColor: "bg-green-400/10" },
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function LiveLog({ logs }: LiveLogProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, autoScroll])

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setAutoScroll(isAtBottom)
    }
  }

  const filteredLogs = filter
    ? logs.filter((log) => log.level === filter || log.agentName === filter)
    : logs

  const agents = [...new Set(logs.map((log) => log.agentName))]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Badge
          variant={filter === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilter(null)}
        >
          All
        </Badge>
        {agents.map((agent) => {
          const config = AGENT_CONFIG[agent] || AGENT_CONFIG.System
          return (
            <Badge
              key={agent}
              variant={filter === agent ? "default" : "outline"}
              className={cn("cursor-pointer", filter === agent && config.bgColor)}
              onClick={() => setFilter(filter === agent ? null : agent)}
            >
              {agent}
            </Badge>
          )
        })}
        <div className="h-4 w-px bg-border" />
        <Badge
          variant={filter === "error" ? "destructive" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilter(filter === "error" ? null : "error")}
        >
          Errors
        </Badge>
        <Badge
          variant={filter === "warning" ? "secondary" : "outline"}
          className={cn("cursor-pointer", filter === "warning" && "bg-yellow-400/20 text-yellow-400")}
          onClick={() => setFilter(filter === "warning" ? null : "warning")}
        >
          Warnings
        </Badge>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto rounded-lg border border-border bg-background/50 font-mono text-sm"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Info className="mr-2 h-4 w-4" />
            {logs.length === 0 ? "Waiting for logs..." : "No matching logs"}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredLogs.map((log, index) => {
              const agentConfig = AGENT_CONFIG[log.agentName] || AGENT_CONFIG.System
              const levelConfig = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.info
              const AgentIcon = agentConfig.icon
              const LevelIcon = levelConfig.icon

              return (
                <motion.div
                  key={log.id || `${log.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "px-3 py-2 border-b border-border/50 transition-colors hover:bg-secondary/30",
                    log.level === "error" && "bg-red-500/5",
                    log.level === "warning" && "bg-yellow-500/5",
                    log.level === "success" && "bg-green-500/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn("rounded p-1", agentConfig.bgColor)}>
                      <AgentIcon className={cn("h-3 w-3", agentConfig.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("font-semibold text-xs", agentConfig.color)}>
                          {log.agentName}
                        </span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-foreground text-xs truncate">{log.action}</span>
                      </div>

                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(log.details).slice(0, 3).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                            >
                              <span className="font-medium text-foreground/70">{key}:</span>
                              <span className="ml-1 truncate max-w-[100px]">
                                {typeof value === "object"
                                  ? JSON.stringify(value).slice(0, 30)
                                  : String(value)}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <LevelIcon className={cn("h-3 w-3", levelConfig.color)} />
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
        <div ref={logsEndRef} />
      </div>

      {!autoScroll && logs.length > 0 && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setAutoScroll(true)
              logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <ChevronDown className="mr-1 h-3 w-3" />
            Jump to latest
          </Button>
        </div>
      )}
    </div>
  )
}
