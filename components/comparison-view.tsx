"use client"

import { useState, useEffect } from "react"
import { Play, Pause, FileText, Download, Clock, DollarSign, Mic, Users, CheckCircle, Loader2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PipelineDashboard } from "@/components/pipeline/pipeline-dashboard"
import { motion, AnimatePresence } from "framer-motion"

interface ComparisonViewProps {
  hybridStoryId: string
  studioStoryId: string
  onClose?: () => void
}

interface StoryStatus {
  status: string
  progress: number
  progressMessage: string
  audioUrl?: string
  actualDurationSeconds?: number
  scriptText?: string
  generationMode?: string
  errorMessage?: string
}

interface MetricComparison {
  metric: string
  hybrid: string | number
  studio: string | number
  winner: "hybrid" | "studio" | "tie"
}

export function ComparisonView({ hybridStoryId, studioStoryId, onClose }: ComparisonViewProps) {
  const [hybridStatus, setHybridStatus] = useState<StoryStatus | null>(null)
  const [studioStatus, setStudioStatus] = useState<StoryStatus | null>(null)
  const [activePlayer, setActivePlayer] = useState<"hybrid" | "studio" | null>(null)
  const [showPipeline, setShowPipeline] = useState<"hybrid" | "studio" | null>(null)
  const [hybridAudio, setHybridAudio] = useState<HTMLAudioElement | null>(null)
  const [studioAudio, setStudioAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchStatus = async (storyId: string, setter: (s: StoryStatus) => void) => {
      try {
        const response = await fetch(`/api/stories/${storyId}/status`)
        if (response.ok) {
          const data = await response.json()
          setter(data)
        }
      } catch (error) {
        console.error("Error fetching status:", error)
      }
    }

    const interval = setInterval(() => {
      fetchStatus(hybridStoryId, setHybridStatus)
      fetchStatus(studioStoryId, setStudioStatus)
    }, 3000)

    fetchStatus(hybridStoryId, setHybridStatus)
    fetchStatus(studioStoryId, setStudioStatus)

    return () => clearInterval(interval)
  }, [hybridStoryId, studioStoryId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      failed: "destructive",
      processing: "secondary",
      pending: "outline",
    }
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return "—"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlay = (mode: "hybrid" | "studio") => {
    const status = mode === "hybrid" ? hybridStatus : studioStatus
    if (!status?.audioUrl) return

    if (activePlayer === mode) {
      const audio = mode === "hybrid" ? hybridAudio : studioAudio
      audio?.pause()
      setActivePlayer(null)
    } else {
      hybridAudio?.pause()
      studioAudio?.pause()

      const audioUrl = status.audioUrl.startsWith("/api/audio") 
        ? status.audioUrl 
        : `/api/audio?path=${encodeURIComponent(status.audioUrl)}`
      
      const audio = new Audio(audioUrl)
      audio.play()
      audio.onended = () => setActivePlayer(null)
      
      if (mode === "hybrid") {
        setHybridAudio(audio)
      } else {
        setStudioAudio(audio)
      }
      setActivePlayer(mode)
    }
  }

  const metrics: MetricComparison[] = []
  
  if (hybridStatus?.status === "completed" && studioStatus?.status === "completed") {
    const hybridDuration = hybridStatus.actualDurationSeconds || 0
    const studioDuration = studioStatus.actualDurationSeconds || 0
    
    metrics.push(
      {
        metric: "Duration",
        hybrid: formatDuration(hybridDuration),
        studio: formatDuration(studioDuration),
        winner: Math.abs(hybridDuration - studioDuration) < 30 ? "tie" : hybridDuration > studioDuration ? "hybrid" : "studio",
      },
      {
        metric: "Script Control",
        hybrid: "Full (Claude)",
        studio: "Limited (GenFM)",
        winner: "hybrid",
      },
      {
        metric: "Multi-Voice",
        hybrid: "No",
        studio: "Yes (2 voices)",
        winner: "studio",
      },
      {
        metric: "Audio Quality",
        hybrid: "Standard TTS",
        studio: "GenFM Optimized",
        winner: "studio",
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mode Comparison</h2>
          <p className="text-muted-foreground">See both generation approaches side-by-side</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>Close</Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Mic className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Hybrid Mode</CardTitle>
                  <CardDescription>Claude + ElevenLabs TTS</CardDescription>
                </div>
              </div>
              {hybridStatus && getStatusBadge(hybridStatus.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {hybridStatus?.status === "processing" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{hybridStatus.progressMessage}</span>
                  <span>{hybridStatus.progress}%</span>
                </div>
                <Progress value={hybridStatus.progress} className="h-2" />
              </div>
            )}

            {hybridStatus?.status === "completed" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {formatDuration(hybridStatus.actualDurationSeconds)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={activePlayer === "hybrid" ? "secondary" : "default"}
                    onClick={() => handlePlay("hybrid")}
                  >
                    {activePlayer === "hybrid" ? (
                      <Pause className="h-4 w-4 mr-1" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    {activePlayer === "hybrid" ? "Pause" : "Play"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowPipeline("hybrid")}>
                    <FileText className="h-4 w-4 mr-1" />
                    Pipeline
                  </Button>
                </div>
              </div>
            )}

            {hybridStatus?.status === "failed" && (
              <div className="text-sm text-red-500">
                {hybridStatus.errorMessage || "Generation failed"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Studio Mode</CardTitle>
                  <CardDescription>GenFM Podcast</CardDescription>
                </div>
              </div>
              {studioStatus && getStatusBadge(studioStatus.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {studioStatus?.status === "processing" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{studioStatus.progressMessage}</span>
                  <span>{studioStatus.progress}%</span>
                </div>
                <Progress value={studioStatus.progress} className="h-2" />
              </div>
            )}

            {studioStatus?.status === "completed" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {formatDuration(studioStatus.actualDurationSeconds)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={activePlayer === "studio" ? "secondary" : "default"}
                    onClick={() => handlePlay("studio")}
                  >
                    {activePlayer === "studio" ? (
                      <Pause className="h-4 w-4 mr-1" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    {activePlayer === "studio" ? "Pause" : "Play"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowPipeline("studio")}>
                    <FileText className="h-4 w-4 mr-1" />
                    Pipeline
                  </Button>
                </div>
              </div>
            )}

            {studioStatus?.status === "failed" && (
              <div className="text-sm text-red-500">
                {studioStatus.errorMessage || "Generation failed"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metrics Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Metric</th>
                    <th className="text-center py-2 px-4 text-blue-500">Hybrid</th>
                    <th className="text-center py-2 px-4 text-purple-500">Studio</th>
                    <th className="text-center py-2 px-4">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m, i) => (
                    <tr key={i} className="border-b border-muted">
                      <td className="py-2 px-4 font-medium">{m.metric}</td>
                      <td className={`text-center py-2 px-4 ${m.winner === "hybrid" ? "text-green-500 font-semibold" : ""}`}>
                        {m.hybrid}
                      </td>
                      <td className={`text-center py-2 px-4 ${m.winner === "studio" ? "text-green-500 font-semibold" : ""}`}>
                        {m.studio}
                      </td>
                      <td className="text-center py-2 px-4">
                        <Badge variant={m.winner === "tie" ? "outline" : "default"}>
                          {m.winner === "tie" ? "Tie" : m.winner === "hybrid" ? "Hybrid" : "Studio"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {showPipeline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {showPipeline === "hybrid" ? "Hybrid" : "Studio"} Pipeline Details
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowPipeline(null)}>
                  Close
                </Button>
              </CardHeader>
              <CardContent>
                <PipelineDashboard 
                  storyId={showPipeline === "hybrid" ? hybridStoryId : studioStoryId} 
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
