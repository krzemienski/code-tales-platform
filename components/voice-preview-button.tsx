"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

let currentAudio: HTMLAudioElement | null = null
let currentSetPlaying: ((playing: boolean) => void) | null = null

interface VoicePreviewButtonProps {
  voiceId: string
  className?: string
}

export function VoicePreviewButton({ voiceId, className }: VoicePreviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch("/api/voices/preview", { method: "HEAD" })
      .then((res) => setIsAvailable(res.ok))
      .catch(() => setIsAvailable(false))
  }, [])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    if (currentAudio && currentSetPlaying) {
      currentAudio.pause()
      currentSetPlaying(false)
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/voices/preview?voiceId=${voiceId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch preview")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const audio = new Audio(url)
      audioRef.current = audio
      currentAudio = audio
      currentSetPlaying = setIsPlaying

      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(url)
        if (currentAudio === audio) {
          currentAudio = null
          currentSetPlaying = null
        }
      }

      audio.onpause = () => {
        setIsPlaying(false)
      }

      await audio.play()
      setIsPlaying(true)
    } catch (error) {
      console.error("Error playing preview:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isAvailable === null || isAvailable === false) {
    return null
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center w-6 h-6 rounded-full",
        "bg-primary/10 hover:bg-primary/20 text-primary",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      aria-label={isPlaying ? "Pause preview" : "Play preview"}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-3 w-3" />
      ) : (
        <Play className="h-3 w-3 ml-0.5" />
      )}
    </button>
  )
}
