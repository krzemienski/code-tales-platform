"use client"

import { Wand2, Podcast, Check, GitCompare, Sparkles, Mic2, FileText, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { GenerationMode } from "@/lib/generation/modes"

interface GenerationModeSelectorProps {
  selectedMode: GenerationMode
  onModeChange: (mode: GenerationMode) => void
  compareEnabled: boolean
  onCompareChange: (enabled: boolean) => void
}

export function GenerationModeSelector({
  selectedMode,
  onModeChange,
  compareEnabled,
  onCompareChange,
}: GenerationModeSelectorProps) {
  const modes = [
    {
      id: "hybrid" as GenerationMode,
      name: "Hybrid Mode",
      subtitle: "Claude + TTS",
      icon: Wand2,
      description: "Full script control with Claude AI, high-quality voice synthesis via ElevenLabs TTS",
      benefits: [
        { icon: FileText, text: "Custom script generation" },
        { icon: Sparkles, text: "Advanced prompt engineering" },
        { icon: Mic2, text: "Precise voice control" },
        { icon: Zap, text: "Long-form content support" },
      ],
      color: "blue",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "elevenlabs_studio" as GenerationMode,
      name: "Studio Mode",
      subtitle: "GenFM / Audiobook",
      icon: Podcast,
      description: "Professional podcast and audiobook production with ElevenLabs Studio pipeline",
      benefits: [
        { icon: Podcast, text: "GenFM podcast engine" },
        { icon: Mic2, text: "Multi-voice conversations" },
        { icon: Sparkles, text: "AI-generated music & SFX" },
        { icon: FileText, text: "Professional mastering" },
      ],
      color: "purple",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
  ]

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Generation Mode</Label>

      <div className="grid sm:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id
          const Icon = mode.icon

          return (
            <Card
              key={mode.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden",
                isSelected
                  ? mode.color === "purple"
                    ? "border-purple-500 ring-2 ring-purple-500/20"
                    : "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-border hover:border-muted-foreground/50",
              )}
              onClick={() => onModeChange(mode.id)}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity",
                  mode.gradient,
                  isSelected && "opacity-100",
                )}
              />
              <CardContent className="relative p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      isSelected
                        ? mode.color === "purple"
                          ? "bg-purple-500/30"
                          : "bg-blue-500/30"
                        : "bg-muted",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isSelected
                          ? mode.color === "purple"
                            ? "text-purple-400"
                            : "text-blue-400"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{mode.name}</h3>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p
                      className={cn(
                        "text-xs font-medium mt-0.5",
                        isSelected
                          ? mode.color === "purple"
                            ? "text-purple-400"
                            : "text-blue-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {mode.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {mode.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {mode.benefits.map((benefit, idx) => {
                    const BenefitIcon = benefit.icon
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs",
                          isSelected
                            ? mode.color === "purple"
                              ? "bg-purple-500/10 text-purple-300"
                              : "bg-blue-500/10 text-blue-300"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <BenefitIcon className="h-3 w-3 shrink-0" />
                        <span className="truncate">{benefit.text}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
        <div className="flex items-center gap-3">
          <GitCompare className="h-5 w-5 text-muted-foreground" />
          <div>
            <Label className="text-sm font-medium">Compare Both</Label>
            <p className="text-xs text-muted-foreground">
              Generate with both modes to compare results
            </p>
          </div>
        </div>
        <Switch checked={compareEnabled} onCheckedChange={onCompareChange} />
      </div>
    </div>
  )
}
