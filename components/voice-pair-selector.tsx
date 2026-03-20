"use client"

import { useState, useEffect } from "react"
import { Mic, Users, Volume2, Loader2, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VoicePreviewButton } from "@/components/voice-preview-button"
import { cn } from "@/lib/utils"

interface Voice {
  id: string
  name: string
  category?: string
  description?: string
  previewUrl?: string
}

interface VoicePair {
  id: string
  name: string
  host: { id: string; name: string }
  guest: { id: string; name: string }
}

interface VoicePairSelectorProps {
  hostVoiceId: string
  guestVoiceId?: string
  onHostChange: (voiceId: string) => void
  onGuestChange: (voiceId: string | undefined) => void
}

const PRESET_PAIRS = [
  {
    id: "tech_podcast",
    name: "Tech Podcast",
    description: "Professional tech discussion",
    hostId: "21m00Tcm4TlvDq8ikWAM",
    guestId: "AZnzlk1XvdvUeBnXmlld",
  },
  {
    id: "documentary",
    name: "Documentary",
    description: "Documentary-style narration",
    hostId: "ErXwobaYiN019PkySvjV",
    guestId: "TxGEqnHWrfWFTfGW9XjX",
  },
  {
    id: "casual_chat",
    name: "Casual Chat",
    description: "Friendly conversation style",
    hostId: "pNInz6obpgDQGcFmaJgB",
    guestId: "EXAVITQu4vr4xnSDxMaL",
  },
]

export function VoicePairSelector({
  hostVoiceId,
  guestVoiceId,
  onHostChange,
  onGuestChange,
}: VoicePairSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([])
  const [recommendedPairs, setRecommendedPairs] = useState<VoicePair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVoices() {
      try {
        const response = await fetch("/api/voices")
        if (!response.ok) throw new Error("Failed to fetch voices")

        const data = await response.json()
        setVoices(data.voices || data.all || [])
        setRecommendedPairs(data.recommended || [])
      } catch (err) {
        console.error("Error fetching voices:", err)
        setError(err instanceof Error ? err.message : "Failed to load voices")
      } finally {
        setLoading(false)
      }
    }

    fetchVoices()
  }, [])

  const handlePresetSelect = (presetId: string) => {
    const preset = PRESET_PAIRS.find((p) => p.id === presetId)
    if (preset) {
      setSelectedPreset(presetId)
      onHostChange(preset.hostId)
      onGuestChange(preset.guestId)
    }
  }

  const handleHostChange = (voiceId: string) => {
    setSelectedPreset(null)
    onHostChange(voiceId)
  }

  const handleGuestChange = (voiceId: string) => {
    setSelectedPreset(null)
    if (voiceId === "none") {
      onGuestChange(undefined)
    } else {
      onGuestChange(voiceId)
    }
  }

  const getVoiceName = (voiceId: string): string => {
    const voice = voices.find((v) => v.id === voiceId)
    return voice?.name || voiceId
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Voice Presets</Label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_PAIRS.map((preset) => (
            <Button
              key={preset.id}
              variant={selectedPreset === preset.id ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetSelect(preset.id)}
              className={cn(
                "flex flex-col h-auto py-3 px-3",
                selectedPreset === preset.id && "bg-purple-600 hover:bg-purple-700",
              )}
            >
              <span className="font-medium text-xs">{preset.name}</span>
              <span className="text-[10px] opacity-70">{preset.description}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Host Voice</Label>
        </div>
        <div className="flex items-center gap-2">
          <Select value={hostVoiceId} onValueChange={handleHostChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select host voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Recommended</SelectLabel>
                {recommendedPairs.map((pair) => (
                  <SelectItem key={`rec-host-${pair.id}`} value={pair.host.id}>
                    {pair.host.name}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>All Voices</SelectLabel>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                    {voice.category && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        ({voice.category})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {hostVoiceId && <VoicePreviewButton voiceId={hostVoiceId} />}
        </div>
        {hostVoiceId && (
          <p className="text-xs text-muted-foreground">
            Selected: {getVoiceName(hostVoiceId)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Guest Voice</Label>
          <span className="text-xs text-muted-foreground">(Optional)</span>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={guestVoiceId || "none"}
            onValueChange={handleGuestChange}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select guest voice (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No guest (monologue)</SelectItem>
              <SelectGroup>
                <SelectLabel>Recommended</SelectLabel>
                {recommendedPairs.map((pair) => (
                  <SelectItem key={`rec-guest-${pair.id}`} value={pair.guest.id}>
                    {pair.guest.name}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>All Voices</SelectLabel>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                    {voice.category && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        ({voice.category})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {guestVoiceId && <VoicePreviewButton voiceId={guestVoiceId} />}
        </div>
        {guestVoiceId && (
          <p className="text-xs text-muted-foreground">
            Selected: {getVoiceName(guestVoiceId)}
          </p>
        )}
      </div>

      {hostVoiceId && guestVoiceId && (
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium">Conversation Mode</p>
                <p className="text-xs text-muted-foreground">
                  {getVoiceName(hostVoiceId)} will host with {getVoiceName(guestVoiceId)} as guest
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
