"use client"

import { Podcast, BookOpen, Clock, Sparkles, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

type StudioFormat = "podcast" | "audiobook"
type StudioDuration = "short" | "default" | "long"
type StudioQuality = "standard" | "high" | "ultra"

interface StudioOptionsProps {
  format: StudioFormat
  duration: StudioDuration
  quality: StudioQuality
  instructions: string
  onChange: (updates: Partial<{
    format: StudioFormat
    duration: StudioDuration
    quality: StudioQuality
    instructions: string
  }>) => void
}

const formatOptions = [
  {
    id: "podcast" as StudioFormat,
    name: "Podcast",
    subtitle: "GenFM",
    icon: Podcast,
    description: "Conversational format with host and optional guest",
  },
  {
    id: "audiobook" as StudioFormat,
    name: "Audiobook",
    subtitle: "Narration",
    icon: BookOpen,
    description: "Single narrator with professional audio quality",
  },
]

const durationOptions = [
  {
    id: "short" as StudioDuration,
    name: "Short",
    description: "< 3 minutes",
    icon: "⚡",
  },
  {
    id: "default" as StudioDuration,
    name: "Default",
    description: "3-7 minutes",
    icon: "📻",
  },
  {
    id: "long" as StudioDuration,
    name: "Long",
    description: "> 7 minutes",
    icon: "📚",
  },
]

const qualityOptions = [
  {
    id: "standard" as StudioQuality,
    name: "Standard",
    description: "128kbps, fast processing",
    cost: "1x",
  },
  {
    id: "high" as StudioQuality,
    name: "High",
    description: "192kbps, improved quality",
    cost: "1.2x",
  },
  {
    id: "ultra" as StudioQuality,
    name: "Ultra",
    description: "Highest quality processing",
    cost: "1.5x",
  },
]

export function StudioOptions({
  format,
  duration,
  quality,
  instructions,
  onChange,
}: StudioOptionsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Format</Label>
        <div className="grid grid-cols-2 gap-3">
          {formatOptions.map((option) => {
            const isSelected = format === option.id
            const Icon = option.icon
            return (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected
                    ? "border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/5"
                    : "border-border hover:border-muted-foreground/50",
                )}
                onClick={() => onChange({ format: option.id })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-purple-500/20" : "bg-muted",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isSelected ? "text-purple-400" : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{option.name}</h4>
                      <p className="text-xs text-muted-foreground">{option.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{option.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Duration</Label>
        </div>
        <RadioGroup
          value={duration}
          onValueChange={(value: StudioDuration) => onChange({ duration: value })}
          className="grid grid-cols-3 gap-2"
        >
          {durationOptions.map((option) => (
            <Label
              key={option.id}
              htmlFor={`duration-${option.id}`}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-colors text-center",
                duration === option.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-border hover:border-muted-foreground/50",
              )}
            >
              <RadioGroupItem
                value={option.id}
                id={`duration-${option.id}`}
                className="sr-only"
              />
              <span className="text-lg">{option.icon}</span>
              <span className="text-xs font-medium">{option.name}</span>
              <span className="text-[10px] text-muted-foreground">{option.description}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Quality Preset</Label>
        </div>
        <RadioGroup
          value={quality}
          onValueChange={(value: StudioQuality) => onChange({ quality: value })}
          className="grid grid-cols-3 gap-2"
        >
          {qualityOptions.map((option) => (
            <Label
              key={option.id}
              htmlFor={`quality-${option.id}`}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-colors text-center",
                quality === option.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-border hover:border-muted-foreground/50",
              )}
            >
              <RadioGroupItem
                value={option.id}
                id={`quality-${option.id}`}
                className="sr-only"
              />
              <span className="text-xs font-medium">{option.name}</span>
              <span className="text-[10px] text-muted-foreground">{option.description}</span>
              <span className="text-[10px] text-purple-400">{option.cost}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {format === "podcast" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Custom Instructions</Label>
          </div>
          <Textarea
            value={instructions}
            onChange={(e) => onChange({ instructions: e.target.value })}
            placeholder="Add instructions for the AI hosts (e.g., 'Focus on the technical architecture' or 'Keep the tone casual and humorous')"
            className="min-h-[100px] resize-none bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            These instructions guide the GenFM AI in how to present your content
          </p>
        </div>
      )}
    </div>
  )
}
