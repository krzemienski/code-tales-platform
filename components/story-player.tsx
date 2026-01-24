"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  List,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  Download,
  Keyboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollingWaveform } from "@/components/ui/waveform"
import { Orb } from "@/components/ui/orb"
import { useAuth } from "@/lib/auth/use-auth"
import { toast } from "sonner"
import type { StoryChapter } from "@/lib/types"

interface StoryPlayerProps {
  storyId: string
  title: string
  subtitle?: string
  audioUrl?: string
  audioChunks?: string[]
  chapters?: StoryChapter[]
  initialPosition?: number
  scriptText?: string
  className?: string
  isDemo?: boolean
  repositoryName?: string
}

interface SavedProgress {
  currentChunk: number
  currentTime: number
  lastPlayed: string
}

const STORAGE_KEY_PREFIX = "codetales_progress_"

export function StoryPlayer({
  storyId,
  title,
  subtitle,
  audioUrl,
  audioChunks = [],
  chapters = [],
  initialPosition = 0,
  scriptText,
  className,
  isDemo,
  repositoryName,
}: StoryPlayerProps) {
  const { user } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialPosition)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showChapters, setShowChapters] = useState(false)
  const [showScript, setShowScript] = useState(false)
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(null)
  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null)

  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)
  const [chunkDurations, setChunkDurations] = useState<number[]>([])
  const [totalDuration, setTotalDuration] = useState(0)
  const [isLoadingChunk, setIsLoadingChunk] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const localSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  const getAudioApiUrl = (path: string) => {
    if (!path) return ""
    if (path.startsWith("/api/audio") || path.startsWith("http")) return path
    return `/api/audio?path=${encodeURIComponent(path)}`
  }

  const effectiveAudioChunks = (audioChunks.length > 0 ? audioChunks : audioUrl ? [audioUrl] : []).map(getAudioApiUrl)
  const hasMultipleChunks = effectiveAudioChunks.length > 1

  const getChunkStartTime = useCallback(
    (chunkIndex: number) => {
      return chunkDurations.slice(0, chunkIndex).reduce((sum, d) => sum + d, 0)
    },
    [chunkDurations],
  )

  const getGlobalTime = useCallback(
    (chunkIndex: number, chunkTime: number) => {
      return getChunkStartTime(chunkIndex) + chunkTime
    },
    [getChunkStartTime],
  )

  const findChunkForTime = useCallback(
    (globalTime: number): { chunkIndex: number; localTime: number } => {
      let accumulated = 0
      for (let i = 0; i < chunkDurations.length; i++) {
        if (globalTime < accumulated + chunkDurations[i]) {
          return { chunkIndex: i, localTime: globalTime - accumulated }
        }
        accumulated += chunkDurations[i]
      }
      return {
        chunkIndex: Math.max(0, chunkDurations.length - 1),
        localTime: chunkDurations[chunkDurations.length - 1] || 0,
      }
    },
    [chunkDurations],
  )

  const currentChapter = chapters.find((ch, i) => {
    const nextChapter = chapters[i + 1]
    const chapterEnd = ch.duration_seconds ? ch.start_time_seconds + ch.duration_seconds : (nextChapter?.start_time_seconds ?? Number.POSITIVE_INFINITY)
    return currentTime >= ch.start_time_seconds && currentTime < chapterEnd
  })

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }, [])

  const saveToLocalStorage = useCallback((time: number, chunk: number) => {
    if (time < 5) return
    const progress: SavedProgress = {
      currentChunk: chunk,
      currentTime: time,
      lastPlayed: new Date().toISOString(),
    }
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${storyId}`, JSON.stringify(progress))
    } catch (error) {
      console.error("[StoryPlayer] Failed to save to localStorage:", error)
    }
  }, [storyId])

  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${storyId}`)
    } catch (error) {
      console.error("[StoryPlayer] Failed to clear localStorage:", error)
    }
  }, [storyId])

  const loadFromLocalStorage = useCallback((): SavedProgress | null => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${storyId}`)
      if (saved) {
        return JSON.parse(saved) as SavedProgress
      }
    } catch (error) {
      console.error("[StoryPlayer] Failed to load from localStorage:", error)
    }
    return null
  }, [storyId])

  const savePosition = useCallback(
    async (position: number) => {
      if (isDemo || !user) return
      
      try {
        await fetch(`/api/stories/${storyId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            last_played_position: Math.floor(position),
            last_played_at: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("[StoryPlayer] Failed to save position:", error)
      }
    },
    [storyId, isDemo, user],
  )

  const debouncedSavePosition = useCallback(
    (position: number) => {
      if (isDemo || !user) return
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = setTimeout(() => {
        savePosition(position)
      }, 5000)
    },
    [savePosition, isDemo, user],
  )

  const showShortcutFeedback = useCallback((message: string) => {
    setShortcutFeedback(message)
    setTimeout(() => setShortcutFeedback(null), 800)
  }, [])

  useEffect(() => {
    const saved = loadFromLocalStorage()
    if (saved && saved.currentTime > 10) {
      setSavedProgress(saved)
      setShowResumePrompt(true)
    }
  }, [loadFromLocalStorage])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  useEffect(() => {
    if (effectiveAudioChunks.length === 0) return

    const loadDurations = async () => {
      const durations: number[] = []

      for (const url of effectiveAudioChunks) {
        try {
          const audio = new Audio()
          await new Promise<void>((resolve) => {
            audio.onloadedmetadata = () => {
              durations.push(audio.duration)
              resolve()
            }
            audio.onerror = () => {
              durations.push(180)
              resolve()
            }
            audio.src = url
          })
        } catch {
          durations.push(180)
        }
      }

      setChunkDurations(durations)
      setTotalDuration(durations.reduce((sum, d) => sum + d, 0))
    }

    loadDurations()
  }, [effectiveAudioChunks])

  useEffect(() => {
    if (isDemo) return
    if (isPlaying && currentTime < 5) {
      fetch(`/api/stories/${storyId}/play-count`, { method: "POST" }).catch((err) => {
        console.log("[StoryPlayer] Play count update failed:", err)
      })
    }
  }, [isPlaying, currentTime, storyId, isDemo])

  useEffect(() => {
    if (isPlaying) {
      localSaveIntervalRef.current = setInterval(() => {
        saveToLocalStorage(currentTime, currentChunkIndex)
      }, 5000)
    } else {
      if (localSaveIntervalRef.current) {
        clearInterval(localSaveIntervalRef.current)
        localSaveIntervalRef.current = null
      }
    }

    return () => {
      if (localSaveIntervalRef.current) {
        clearInterval(localSaveIntervalRef.current)
      }
    }
  }, [isPlaying, currentTime, currentChunkIndex, saveToLocalStorage])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentTime > 5) {
        saveToLocalStorage(currentTime, currentChunkIndex)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [currentTime, currentChunkIndex, saveToLocalStorage])

  const handleSeek = useCallback((value: number[]) => {
    const newGlobalTime = value[0]

    if (hasMultipleChunks && chunkDurations.length > 0) {
      const { chunkIndex, localTime } = findChunkForTime(newGlobalTime)

      if (chunkIndex !== currentChunkIndex) {
        setCurrentChunkIndex(chunkIndex)
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = localTime
            if (isPlaying) audioRef.current.play()
          }
        }, 100)
      } else if (audioRef.current) {
        audioRef.current.currentTime = localTime
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = newGlobalTime
    }

    setCurrentTime(newGlobalTime)
  }, [hasMultipleChunks, chunkDurations, findChunkForTime, currentChunkIndex, isPlaying])

  const handleSkip = useCallback((seconds: number) => {
    const displayDuration = totalDuration || duration || 1845
    const newTime = Math.max(0, Math.min(displayDuration, currentTime + seconds))
    handleSeek([newTime])
  }, [totalDuration, duration, currentTime, handleSeek])

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        savePosition(currentTime)
        saveToLocalStorage(currentTime, currentChunkIndex)
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else if (effectiveAudioChunks.length === 0) {
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying, currentTime, currentChunkIndex, effectiveAudioChunks.length, savePosition, saveToLocalStorage])

  const handleVolumeChange = useCallback((delta: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta))
    setVolume(newVolume)
    setIsMuted(false)
  }, [volume])

  // State for artwork URL (created client-side only)
  const [placeholderArtwork, setPlaceholderArtwork] = useState("")
  
  // Create artwork on client-side only
  useEffect(() => {
    if (typeof document === "undefined") return
    
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 256, 256)
    gradient.addColorStop(0, "#4ade80")
    gradient.addColorStop(1, "#22c55e")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)

    // Draw circle
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.beginPath()
    ctx.arc(128, 128, 100, 0, Math.PI * 2)
    ctx.fill()

    // Draw text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Code Tales", 128, 128)

    setPlaceholderArtwork(canvas.toDataURL())
  }, [])

  // Helper function to find current chapter index
  const getCurrentChapterIndex = useCallback((): number => {
    return chapters.findIndex((ch, i) => {
      const nextChapter = chapters[i + 1]
      const chapterEnd = ch.duration_seconds
        ? ch.start_time_seconds + ch.duration_seconds
        : nextChapter?.start_time_seconds ?? Number.POSITIVE_INFINITY
      return currentTime >= ch.start_time_seconds && currentTime < chapterEnd
    })
  }, [chapters, currentTime])

  // Media Session API integration - setup handlers and metadata
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaSession) return

    try {
      // Set metadata (only depends on title/repository, not playback state)
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: "Code Tales",
        album: repositoryName || "Code Tales",
        artwork: placeholderArtwork ? [{ src: placeholderArtwork, sizes: "256x256", type: "image/png" }] : undefined,
      })

      // Set action handlers (stable functions)
      navigator.mediaSession.setActionHandler("play", () => {
        if (!isPlaying && audioRef.current) {
          audioRef.current.play()
          setIsPlaying(true)
        }
      })

      navigator.mediaSession.setActionHandler("pause", () => {
        if (isPlaying && audioRef.current) {
          audioRef.current.pause()
          setIsPlaying(false)
        }
      })

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (chapters.length > 0) {
          const currentChapterIndex = getCurrentChapterIndex()
          if (currentChapterIndex > 0) {
            const previousChapter = chapters[currentChapterIndex - 1]
            handleSeek([previousChapter.start_time_seconds])
            if (!isPlaying && audioRef.current) {
              audioRef.current.play()
              setIsPlaying(true)
            }
          } else {
            handleSeek([0])
          }
        }
      })

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (chapters.length > 0) {
          const currentChapterIndex = getCurrentChapterIndex()
          if (currentChapterIndex < chapters.length - 1) {
            const nextChapter = chapters[currentChapterIndex + 1]
            handleSeek([nextChapter.start_time_seconds])
            if (!isPlaying && audioRef.current) {
              audioRef.current.play()
              setIsPlaying(true)
            }
          } else {
            const displayDuration = totalDuration || duration || 1845
            handleSeek([displayDuration])
          }
        }
      })

      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const skipTime = details.seekTime || 10
        handleSkip(-skipTime)
      })

      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const skipTime = details.seekTime || 10
        handleSkip(skipTime)
      })

      // Add seekto handler for direct position seeking on mobile devices
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime !== undefined) {
          handleSeek([details.seekTime])
        }
      })
    } catch (error) {
      console.warn("[StoryPlayer] Media Session API handler registration failed:", error)
    }
  }, [title, repositoryName, chapters, handleSeek, handleSkip, isPlaying, getCurrentChapterIndex, totalDuration, duration, placeholderArtwork])

  // Separate effect for updating position state during playback
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaSession) return

    try {
      const displayDuration = totalDuration || duration || 1845
      // Always initialize position state, even with 0 duration
      navigator.mediaSession.setPositionState({
        duration: displayDuration > 0 ? displayDuration : 0,
        playbackRate: playbackRate,
        position: currentTime,
      })
    } catch (error) {
      // Silently ignore position state update errors
    }
  }, [currentTime, playbackRate, totalDuration, duration])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const isTyping = tagName === "input" || tagName === "textarea" || target.isContentEditable

      if (isTyping) return

      const displayDuration = totalDuration || duration || 1845

      switch (e.key) {
        case " ":
          e.preventDefault()
          handlePlayPause()
          showShortcutFeedback(isPlaying ? "⏸ Paused" : "▶ Playing")
          break

        case "ArrowLeft":
          e.preventDefault()
          handleSkip(-10)
          showShortcutFeedback("⏪ -10s")
          break

        case "ArrowRight":
          e.preventDefault()
          handleSkip(10)
          showShortcutFeedback("⏩ +10s")
          break

        case "ArrowUp":
          e.preventDefault()
          handleVolumeChange(0.1)
          showShortcutFeedback(`🔊 ${Math.round((volume + 0.1) * 100)}%`)
          break

        case "ArrowDown":
          e.preventDefault()
          handleVolumeChange(-0.1)
          showShortcutFeedback(`🔉 ${Math.round(Math.max(0, volume - 0.1) * 100)}%`)
          break

        case "m":
        case "M":
          e.preventDefault()
          setIsMuted(!isMuted)
          showShortcutFeedback(isMuted ? "🔊 Unmuted" : "🔇 Muted")
          break

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          e.preventDefault()
          const percentage = parseInt(e.key) * 10
          const seekTime = (percentage / 100) * displayDuration
          handleSeek([seekTime])
          showShortcutFeedback(`⏭ ${percentage}%`)
          break

        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    isPlaying,
    isMuted,
    volume,
    totalDuration,
    duration,
    handlePlayPause,
    handleSkip,
    handleVolumeChange,
    handleSeek,
    showShortcutFeedback,
  ])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const globalTime = getGlobalTime(currentChunkIndex, audioRef.current.currentTime)
      setCurrentTime(globalTime)
      debouncedSavePosition(globalTime)

      // Update Media Session position state if available
      if (typeof navigator !== "undefined" && navigator.mediaSession) {
        try {
          const displayDuration = totalDuration || duration || 1845
          if (displayDuration > 0) {
            navigator.mediaSession.setPositionState({
              duration: displayDuration,
              playbackRate: playbackRate,
              position: globalTime,
            })
          }
        } catch (error) {
          // Silently ignore Media Session errors
        }
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current && !hasMultipleChunks) {
      setDuration(audioRef.current.duration)
      setTotalDuration(audioRef.current.duration)
      if (initialPosition > 0 && !savedProgress) {
        audioRef.current.currentTime = initialPosition
      }
    }
  }

  const handleChunkEnded = async () => {
    if (currentChunkIndex < effectiveAudioChunks.length - 1) {
      setIsLoadingChunk(true)
      setCurrentChunkIndex(currentChunkIndex + 1)

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
        }
        setIsLoadingChunk(false)
      }, 100)
    } else {
      setIsPlaying(false)
      savePosition(totalDuration)
      clearLocalStorage()
      toast.success("Story completed!", { description: "Thanks for listening!" })
    }
  }

  const handleResumePlayback = () => {
    if (savedProgress) {
      setCurrentChunkIndex(savedProgress.currentChunk)
      setCurrentTime(savedProgress.currentTime)
      
      setTimeout(() => {
        if (audioRef.current) {
          const { localTime } = findChunkForTime(savedProgress.currentTime)
          audioRef.current.currentTime = localTime
          audioRef.current.play()
          setIsPlaying(true)
        }
      }, 100)
      
      toast.success("Resumed playback", { description: `Continuing from ${formatTime(savedProgress.currentTime)}` })
    }
    setShowResumePrompt(false)
  }

  const handleDismissResume = () => {
    setShowResumePrompt(false)
    clearLocalStorage()
  }

  const jumpToChapter = (chapter: StoryChapter) => {
    handleSeek([chapter.start_time_seconds])
    if (!isPlaying && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
    setShowChapters(false)
  }

  const handleDownload = async () => {
    if (effectiveAudioChunks.length === 0) return

    try {
      const response = await fetch(`/api/stories/${storyId}/download`)

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("[StoryPlayer] Download failed:", error)
      window.open(effectiveAudioChunks[0], "_blank")
    }
  }

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const displayDuration =
    totalDuration ||
    duration ||
    chapters.reduce(
      (acc, ch) =>
        acc + (ch.duration_seconds ? ch.duration_seconds : 120),
      0,
    ) ||
    892

  const currentAudioSrc = effectiveAudioChunks[currentChunkIndex] || audioUrl

  return (
    <div ref={playerContainerRef} className={cn("rounded-xl border border-border bg-card relative", className)} tabIndex={0}>
      {currentAudioSrc && (
        <audio
          ref={audioRef}
          src={currentAudioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleChunkEnded}
        />
      )}

      {shortcutFeedback && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-black/80 text-white px-6 py-3 rounded-xl text-lg font-medium animate-in fade-in zoom-in duration-200">
            {shortcutFeedback}
          </div>
        </div>
      )}

      {showResumePrompt && savedProgress && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-40 flex items-center justify-center rounded-xl">
          <div className="text-center p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Resume Playback?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Continue from {formatTime(savedProgress.currentTime)}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={handleDismissResume}>
                Start Over
              </Button>
              <Button size="sm" onClick={handleResumePlayback}>
                Resume
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="mb-6 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/40">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <ScrollingWaveform speed={isPlaying ? 50 : 0} barCount={40} className="h-16 opacity-50" />
            </div>
            <div className="relative z-10 h-20 w-20">
              <Orb
                colors={["#4ade80", "#22c55e"]}
                agentState={isPlaying ? "talking" : isLoadingChunk ? "thinking" : null}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {currentChapter && (
            <p className="text-sm text-muted-foreground">
              Chapter {currentChapter.chapter_number}: {currentChapter.title}
            </p>
          )}
          {subtitle && !currentChapter && <p className="text-sm text-muted-foreground capitalize">{subtitle}</p>}
          {hasMultipleChunks && (
            <p className="text-xs text-muted-foreground/60 mt-1">
              Part {currentChunkIndex + 1} of {effectiveAudioChunks.length}
            </p>
          )}
        </div>

        <div className="mb-4 space-y-2">
          <Slider value={[currentTime]} max={displayDuration} step={1} onValueChange={handleSeek} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(displayDuration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => handleSkip(-15)} className="h-10 w-10">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button size="icon" className="h-16 w-16 rounded-full" onClick={handlePlayPause} disabled={isLoadingChunk}>
            {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleSkip(15)} className="h-10 w-10">
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-10 w-10 sm:h-8 sm:w-8">
              {isMuted ? <VolumeX className="h-5 w-5 sm:h-4 sm:w-4" /> : <Volume2 className="h-5 w-5 sm:h-4 sm:w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(v) => {
                setVolume(v[0] / 100)
                setIsMuted(false)
              }}
              className="w-28 sm:w-24"
            />
          </div>

          <div className="flex items-center gap-3 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs bg-transparent h-9 px-3"
              onClick={() => {
                const currentIndex = playbackRates.indexOf(playbackRate)
                const nextIndex = (currentIndex + 1) % playbackRates.length
                setPlaybackRate(playbackRates[nextIndex])
              }}
            >
              {playbackRate}x
            </Button>

            <div className="flex gap-1">
              {effectiveAudioChunks.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1 h-9 px-2 sm:px-3">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              )}
              {scriptText && (
                <Button variant="ghost" size="sm" onClick={() => setShowScript(!showScript)} className="gap-1 h-9 px-2 sm:px-3">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Script</span>
                </Button>
              )}
              {chapters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setShowChapters(!showChapters)} className="gap-1 h-9 px-2 sm:px-3">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Chapters</span>
                  {showChapters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 hidden sm:flex items-center justify-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
            <Keyboard className="h-3 w-3" />
            <span>Space: Play/Pause</span>
            <span className="mx-1">•</span>
            <span>←→: Seek</span>
            <span className="mx-1">•</span>
            <span>↑↓: Volume</span>
            <span className="mx-1">•</span>
            <span>M: Mute</span>
          </div>
        </div>
      </div>

      {showChapters && chapters.length > 0 && (
        <div className="border-t border-border">
          <div className="max-h-64 overflow-y-auto p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Chapters</h4>
            <div className="space-y-1">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id || chapter.chapter_number}
                  onClick={() => jumpToChapter(chapter)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                    currentChapter?.id === chapter.id && "bg-secondary",
                  )}
                >
                  <span className="flex items-center gap-2 text-foreground">
                    {currentChapter?.id === chapter.id && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                    <span className="text-muted-foreground">{chapter.chapter_number}.</span>
                    <span>{chapter.title}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{formatTime(chapter.start_time_seconds)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showScript && scriptText && (
        <div className="border-t border-border">
          <div className="max-h-96 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">Full Script</h4>
              <Button variant="ghost" size="icon" onClick={() => setShowScript(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">{scriptText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
