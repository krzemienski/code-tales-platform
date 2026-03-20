"use client"

import { useState, useCallback } from "react"
import { Settings2, Volume2, Globe, FileAudio, Sliders, Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface TTSConfig {
  ttsModelId: string
  stability: number
  similarityBoost: number
  style: number
  useSpeakerBoost: boolean
  outputFormat: string
  language: string
}

export const DEFAULT_TTS_CONFIG: TTSConfig = {
  ttsModelId: "eleven_flash_v2_5",
  stability: 0.5,
  similarityBoost: 0.8,
  style: 0,
  useSpeakerBoost: true,
  outputFormat: "mp3_44100_128",
  language: "en",
}

export const TTS_MODELS = [
  {
    id: "eleven_flash_v2_5",
    name: "Flash v2.5",
    description: "Fastest. Low latency, good quality. Best for quick generation.",
    badge: "Fast",
    badgeColor: "text-blue-400",
  },
  {
    id: "eleven_multilingual_v2",
    name: "Multilingual v2",
    description: "High quality. 29 languages. Best for non-English or mixed content.",
    badge: "Quality",
    badgeColor: "text-purple-400",
  },
  {
    id: "eleven_v3",
    name: "v3 (Advanced)",
    description: "Latest model. 70+ languages, emotional range, superior naturalness.",
    badge: "Advanced",
    badgeColor: "text-amber-400",
  },
]

export const OUTPUT_FORMATS = [
  { id: "mp3_22050_32", name: "MP3 22kHz 32kbps", description: "Small file, lower quality" },
  { id: "mp3_44100_64", name: "MP3 44kHz 64kbps", description: "Balanced" },
  { id: "mp3_44100_128", name: "MP3 44kHz 128kbps", description: "Standard quality" },
  { id: "mp3_44100_192", name: "MP3 44kHz 192kbps", description: "High quality" },
  { id: "pcm_16000", name: "PCM 16kHz", description: "Raw audio, 16kHz" },
  { id: "pcm_22050", name: "PCM 22kHz", description: "Raw audio, 22kHz" },
  { id: "pcm_24000", name: "PCM 24kHz", description: "Raw audio, 24kHz" },
  { id: "pcm_44100", name: "PCM 44kHz", description: "Raw audio, 44kHz" },
  { id: "ulaw_8000", name: "u-law 8kHz", description: "Telephony format" },
]

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "pl", name: "Polish" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "tr", name: "Turkish" },
  { code: "ru", name: "Russian" },
  { code: "id", name: "Indonesian" },
  { code: "fil", name: "Filipino" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "hu", name: "Hungarian" },
  { code: "no", name: "Norwegian" },
  { code: "ro", name: "Romanian" },
  { code: "sk", name: "Slovak" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
]

export function getStyleDefaults(narrativeStyle: string): Partial<TTSConfig> {
  switch (narrativeStyle) {
    case "fiction":
      return { stability: 0.35, similarityBoost: 0.8, style: 0.15 }
    case "podcast":
      return { stability: 0.45, similarityBoost: 0.75, style: 0.1 }
    case "documentary":
      return { stability: 0.6, similarityBoost: 0.85, style: 0.05 }
    case "technical":
      return { stability: 0.7, similarityBoost: 0.9, style: 0 }
    case "tutorial":
      return { stability: 0.55, similarityBoost: 0.85, style: 0.05 }
    default:
      return {}
  }
}

interface TTSSettingsProps {
  config: TTSConfig
  onChange: (update: Partial<TTSConfig>) => void
  narrativeStyle?: string
  className?: string
}

export function TTSSettings({ config, onChange, narrativeStyle, className }: TTSSettingsProps) {
  const [expanded, setExpanded] = useState(false)

  const currentModel = TTS_MODELS.find(m => m.id === config.ttsModelId) || TTS_MODELS[0]
  const showLanguage = config.ttsModelId !== "eleven_flash_v2_5"

  const applyStyleDefaults = () => {
    if (narrativeStyle) {
      const defaults = getStyleDefaults(narrativeStyle)
      onChange(defaults)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          TTS Model
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {TTS_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => onChange({ ttsModelId: model.id })}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                config.ttsModelId === model.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-medium">{model.name}</span>
                <span className={cn("text-[10px]", model.badgeColor)}>{model.badge}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">{model.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <Sliders className="h-3.5 w-3.5" />
        <span>Voice Settings</span>
        <span className="text-[10px] ml-auto">{expanded ? "Hide" : "Show"}</span>
      </button>

      {expanded && (
        <div className="space-y-5 pt-1">
          {narrativeStyle && (
            <Button variant="outline" size="sm" onClick={applyStyleDefaults} className="w-full text-xs h-7">
              Apply recommended settings for {narrativeStyle}
            </Button>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Stability</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Higher = more consistent/monotone. Lower = more expressive/variable.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={[config.stability]}
                onValueChange={([v]) => onChange({ stability: v })}
                min={0}
                max={1}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">{config.stability.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Expressive</span>
              <span>Stable</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Similarity Boost</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Higher = closer to original voice sample. Lower = more variation.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={[config.similarityBoost]}
                onValueChange={([v]) => onChange({ similarityBoost: v })}
                min={0}
                max={1}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">{config.similarityBoost.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Style Exaggeration</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Amplifies the voice style. Higher values add more drama/emotion but may reduce stability.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={[config.style]}
                onValueChange={([v]) => onChange({ style: v })}
                min={0}
                max={1}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">{config.style.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs">Speaker Boost</Label>
              <p className="text-[10px] text-muted-foreground">Enhance voice clarity and presence</p>
            </div>
            <Switch
              checked={config.useSpeakerBoost}
              onCheckedChange={(v) => onChange({ useSpeakerBoost: v })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1.5">
              <FileAudio className="h-3 w-3 text-muted-foreground" />
              Output Format
            </Label>
            <Select
              value={config.outputFormat}
              onValueChange={(v) => onChange({ outputFormat: v })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_FORMATS.map(fmt => (
                  <SelectItem key={fmt.id} value={fmt.id} className="text-xs">
                    <span>{fmt.name}</span>
                    <span className="text-muted-foreground ml-2">({fmt.description})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showLanguage && (
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-muted-foreground" />
                Language
              </Label>
              <Select
                value={config.language}
                onValueChange={(v) => onChange({ language: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code} className="text-xs">
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface UseTTSConfigReturn {
  config: TTSConfig
  updateConfig: (update: Partial<TTSConfig>) => void
}

export function useTTSConfig(narrativeStyle?: string): UseTTSConfigReturn {
  const [config, setConfig] = useState<TTSConfig>(() => {
    const defaults = narrativeStyle ? getStyleDefaults(narrativeStyle) : {}
    return { ...DEFAULT_TTS_CONFIG, ...defaults }
  })

  const updateConfig = useCallback((update: Partial<TTSConfig>) => {
    setConfig(prev => ({ ...prev, ...update }))
  }, [])

  return { config, updateConfig }
}
