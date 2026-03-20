"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Zap, MessageSquare, Loader2, Check, Sparkles, Settings2, Save, Clock, Calendar, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RepoInput } from "@/components/repo-input"
import { RepoTreePreview } from "@/components/repo-tree-preview"
import { IntentChat } from "@/components/intent-chat"
import { GenerationEstimate } from "@/components/generation-estimate"
import { Orb } from "@/components/ui/orb"
import { ShimmeringText } from "@/components/ui/shimmering-text"
import { VoiceBrowser } from "@/components/voice-browser"
import { TTSSettings, useTTSConfig, getStyleDefaults, type TTSConfig } from "@/components/tts-settings"
import { useAuth } from "@/lib/auth/use-auth"
import {
  ContentGenerationFramework,
  type StyleConfiguration,
  type PrimaryStyle,
  type SecondaryStyle,
  type ContentFormat,
  type PacingStyle,
  type ToneIntensity,
} from "@/lib/content-generation/framework"

type Step = "repo" | "mode" | "customize" | "style" | "advanced" | "generating"

interface RepoInfo {
  url: string
  owner: string
  name: string
  description: string
  language: string
  stars: number
}

const NARRATIVE_STYLES: Array<{
  id: PrimaryStyle
  name: string
  description: string
  icon: string
  bestFor: string
}> = [
  {
    id: "fiction",
    name: "Fiction",
    description: "Code components become characters in an epic story",
    icon: "🎭",
    bestFor: "Memorable learning, creative exploration",
  },
  {
    id: "documentary",
    name: "Documentary",
    description: "Authoritative, comprehensive analysis",
    icon: "📰",
    bestFor: "Deep understanding, technical overview",
  },
  {
    id: "tutorial",
    name: "Tutorial",
    description: "Patient, step-by-step teaching style",
    icon: "👨‍🏫",
    bestFor: "Learning new codebases, onboarding",
  },
  {
    id: "podcast",
    name: "Podcast",
    description: "Conversational, like chatting with a friend",
    icon: "🎙️",
    bestFor: "Casual learning, commute listening",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Dense, detailed deep-dive for experts",
    icon: "⚙️",
    bestFor: "Code review prep, expert analysis",
  },
]

const SECONDARY_STYLES: Array<{
  id: SecondaryStyle
  name: string
  description: string
}> = [
  { id: "dramatic", name: "Dramatic", description: "Build tension and excitement" },
  { id: "humorous", name: "Humorous", description: "Witty observations and jokes" },
  { id: "suspenseful", name: "Suspenseful", description: "Mystery and discovery" },
  { id: "inspirational", name: "Inspirational", description: "Celebrate elegant code" },
  { id: "analytical", name: "Analytical", description: "Systematic breakdown" },
  { id: "conversational", name: "Conversational", description: "Direct and engaging" },
]

const FORMAT_OPTIONS: Array<{
  id: ContentFormat
  name: string
  description: string
}> = [
  { id: "narrative", name: "Narrative", description: "Continuous flowing prose" },
  { id: "dialogue", name: "Dialogue", description: "Characters discussing code" },
  { id: "monologue", name: "Monologue", description: "Single voice exploration" },
  { id: "interview", name: "Interview", description: "Q&A format" },
  { id: "lecture", name: "Lecture", description: "Academic structure" },
  { id: "story-within-story", name: "Nested", description: "Stories within stories" },
]

const DURATION_OPTIONS = [
  { id: "micro", label: "Micro", minutes: 3, description: "~450 words, quick summary" },
  { id: "quick", label: "Quick", minutes: 5, description: "~750 words, key highlights" },
  { id: "short", label: "Short", minutes: 10, description: "~1,500 words, solid overview" },
  { id: "standard", label: "Standard", minutes: 15, description: "~2,250 words, thorough coverage" },
  { id: "extended", label: "Extended", minutes: 25, description: "~3,750 words, detailed analysis" },
  { id: "deep", label: "Deep Dive", minutes: 30, description: "~4,500 words, comprehensive" },
  { id: "exhaustive", label: "Exhaustive", minutes: 45, description: "~6,750 words, complete" },
  { id: "epic", label: "Epic", minutes: 60, description: "~9,000 words, full immersion" },
]

const EXPERTISE_LEVELS = [
  { id: "beginner", label: "Beginner", description: "Explain concepts, use analogies" },
  { id: "intermediate", label: "Intermediate", description: "Assume programming knowledge" },
  { id: "expert", label: "Expert", description: "Dense information, no hand-holding" },
]

const RECOMMENDED_COMBINATIONS = ContentGenerationFramework.getRecommendedCombinations()

export default function NewStoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [step, setStep] = useState<Step>("repo")
  const [repoUrl, setRepoUrl] = useState("")
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [isLoadingRepo, setIsLoadingRepo] = useState(false)
  const [repoError, setRepoError] = useState<string | null>(null)

  const [narrativeStyle, setNarrativeStyle] = useState<PrimaryStyle>("documentary")
  const [secondaryStyle, setSecondaryStyle] = useState<SecondaryStyle | null>(null)
  const [enableSecondaryPrimaryStyle, setEnableSecondaryPrimaryStyle] = useState(false)
  const [secondaryPrimaryStyle, setSecondaryPrimaryStyle] = useState<PrimaryStyle | null>(null)
  const [styleMixRatio, setStyleMixRatio] = useState(30)
  const [contentFormat, setContentFormat] = useState<ContentFormat>("narrative")
  const [pacing, setPacing] = useState<PacingStyle>("moderate")
  const [toneIntensity, setToneIntensity] = useState<ToneIntensity>("moderate")
  const [duration, setDuration] = useState("standard")
  const [expertise, setExpertise] = useState("intermediate")
  const [voiceId, setVoiceId] = useState("21m00Tcm4TlvDq8ikWAM")
  const ttsConfig = useTTSConfig(narrativeStyle)
  const [intent, setIntent] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationMessage, setGenerationMessage] = useState("")

  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [draftId, setDraftId] = useState<string | null>(null)

  useEffect(() => {
    const draftIdParam = searchParams.get("draft")
    if (draftIdParam) {
      loadDraft(draftIdParam)
      return
    }
    const urlParam = searchParams.get("url")
    if (urlParam && !repoInfo) {
      setRepoUrl(urlParam)
      handleRepoSubmit(urlParam)
    }
  }, [searchParams])

  const loadDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/drafts/${id}`)
      if (response.ok) {
        const { draft } = await response.json()
        setDraftId(draft.id)
        
        if (draft.repositoryUrl) {
          setRepoUrl(draft.repositoryUrl)
          setRepoInfo({
            url: draft.repositoryUrl,
            owner: draft.repositoryOwner || "",
            name: draft.repositoryName || "",
            description: draft.repositoryDescription || "",
            language: draft.repositoryLanguage || "Unknown",
            stars: draft.repositoryStars || 0,
          })
          setStep("style")
        }
        
        const style = draft.styleConfig as Record<string, unknown> || {}
        if (style.narrativeStyle) setNarrativeStyle(style.narrativeStyle as PrimaryStyle)
        if (style.secondaryStyle) setSecondaryStyle(style.secondaryStyle as SecondaryStyle)
        if (style.enableSecondaryPrimaryStyle) setEnableSecondaryPrimaryStyle(style.enableSecondaryPrimaryStyle as boolean)
        if (style.secondaryPrimaryStyle) setSecondaryPrimaryStyle(style.secondaryPrimaryStyle as PrimaryStyle)
        if (style.styleMixRatio) setStyleMixRatio(style.styleMixRatio as number)
        if (style.contentFormat) setContentFormat(style.contentFormat as ContentFormat)
        if (style.pacing) setPacing(style.pacing as PacingStyle)
        if (style.toneIntensity) setToneIntensity(style.toneIntensity as ToneIntensity)
        if (style.duration) setDuration(style.duration as string)
        if (style.expertise) setExpertise(style.expertise as string)
        if (style.intent) setIntent(style.intent as string)
        
        const voice = draft.voiceConfig as Record<string, unknown> || {}
        if (voice.voiceId) setVoiceId(voice.voiceId as string)
        if (voice.ttsConfig) {
          const savedTts = voice.ttsConfig as TTSConfig
          ttsConfig.updateConfig(savedTts)
        }
        
        if (draft.scheduledAt) {
          const date = new Date(draft.scheduledAt)
          setScheduledDate(date.toISOString().split("T")[0])
          setScheduledTime(date.toTimeString().slice(0, 5))
          setShowSchedule(true)
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error)
    }
  }

  const handleSaveDraft = async () => {
    if (!repoInfo) return
    
    setIsSavingDraft(true)
    try {
      const draftData = {
        repositoryUrl: repoInfo.url,
        repositoryName: repoInfo.name,
        repositoryOwner: repoInfo.owner,
        repositoryDescription: repoInfo.description,
        repositoryLanguage: repoInfo.language,
        repositoryStars: repoInfo.stars,
        styleConfig: {
          narrativeStyle,
          secondaryStyle,
          enableSecondaryPrimaryStyle,
          secondaryPrimaryStyle,
          styleMixRatio,
          contentFormat,
          pacing,
          toneIntensity,
          duration,
          expertise,
          intent,
        },
        modelConfig: {},
        voiceConfig: {
          voiceId,
          ttsConfig: ttsConfig.config,
        },
        scheduledAt: showSchedule && scheduledDate && scheduledTime
          ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
          : null,
      }

      const url = draftId ? `/api/drafts/${draftId}` : "/api/drafts"
      const method = draftId ? "PATCH" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftData),
      })

      if (response.ok) {
        const { draft } = await response.json()
        setDraftId(draft.id)
        router.push("/dashboard?saved=draft")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
    } finally {
      setIsSavingDraft(false)
    }
  }

  const applyRecommendedCombination = (config: StyleConfiguration) => {
    setNarrativeStyle(config.primary)
    setSecondaryStyle(config.secondary || null)
    setEnableSecondaryPrimaryStyle(!!config.secondaryPrimaryStyle)
    setSecondaryPrimaryStyle(config.secondaryPrimaryStyle || null)
    setStyleMixRatio(config.styleMixRatio || 30)
    setContentFormat(config.format || "narrative")
    setPacing(config.pacing || "moderate")
    setToneIntensity(config.toneIntensity || "moderate")

    const defaults = getStyleDefaults(config.primary)
    ttsConfig.updateConfig({
      stability: defaults.stability,
      similarityBoost: defaults.similarityBoost,
      style: defaults.style,
    })
  }

  const validateConfiguration = () => {
    const styleConfig: StyleConfiguration = {
      primary: narrativeStyle,
      secondary: secondaryStyle || undefined,
      secondaryPrimaryStyle: enableSecondaryPrimaryStyle && secondaryPrimaryStyle ? secondaryPrimaryStyle : undefined,
      styleMixRatio: enableSecondaryPrimaryStyle && secondaryPrimaryStyle ? styleMixRatio : undefined,
      format: contentFormat,
      pacing,
      toneIntensity,
    }

    const durationMinutes = DURATION_OPTIONS.find((d) => d.id === duration)?.minutes || 15

    const result = ContentGenerationFramework.validateParameters({
      targetDurationMinutes: durationMinutes,
      expertiseLevel: expertise as "beginner" | "intermediate" | "expert",
      style: styleConfig,
    })

    setValidationWarnings([...result.warnings, ...result.suggestions])
    return result.isValid
  }

  const handleRepoSubmit = async (url: string) => {
    setIsLoadingRepo(true)
    setRepoError(null)
    setRepoUrl(url)

    try {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) {
        throw new Error("Invalid GitHub URL")
      }

      const [, owner, name] = match
      const cleanName = name.replace(/\.git$/, "")

      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanName}`)
      if (!response.ok) {
        throw new Error("Repository not found")
      }

      const data = await response.json()
      setRepoInfo({
        url,
        owner: data.owner.login,
        name: data.name,
        description: data.description || "No description available",
        language: data.language || "Unknown",
        stars: data.stargazers_count,
      })
      setStep("mode")
    } catch {
      setRepoError("Could not fetch repository. Please check the URL and try again.")
    } finally {
      setIsLoadingRepo(false)
    }
  }

  const handleIntentComplete = (userIntent: string) => {
    setIntent(userIntent)
    setStep("style")
  }

  const handleGenerate = async () => {
    if (!validateConfiguration()) {
      return
    }

    setIsGenerating(true)
    setStep("generating")
    setGenerationProgress(0)
    setGenerationMessage("Starting story generation...")

    try {
      if (!user || !repoInfo) {
        throw new Error("Not authenticated")
      }

      const currentTtsConfig: TTSConfig = {
        ttsModelId: ttsConfig.config.ttsModelId,
        stability: ttsConfig.config.stability,
        similarityBoost: ttsConfig.config.similarityBoost,
        style: ttsConfig.config.style,
        useSpeakerBoost: ttsConfig.config.useSpeakerBoost,
        outputFormat: ttsConfig.config.outputFormat,
        language: ttsConfig.config.language,
      }

      const createResponse = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoInfo,
          narrativeStyle,
          voiceId,
          targetDurationMinutes: DURATION_OPTIONS.find((d) => d.id === duration)?.minutes || 15,
          expertiseLevel: expertise,
          intent: intent || undefined,
          ttsConfig: currentTtsConfig,
        }),
      })

      if (!createResponse.ok) {
        throw new Error("Failed to create story")
      }

      const { story } = await createResponse.json()

      const styleConfig: StyleConfiguration = {
        primary: narrativeStyle,
        secondary: secondaryStyle || undefined,
        secondaryPrimaryStyle: enableSecondaryPrimaryStyle && secondaryPrimaryStyle ? secondaryPrimaryStyle : undefined,
        styleMixRatio: enableSecondaryPrimaryStyle && secondaryPrimaryStyle ? styleMixRatio : undefined,
        format: contentFormat,
        pacing,
        toneIntensity,
      }

      fetch("/api/stories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: story.id,
          styleConfig,
        }),
      })

      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`/api/stories/${story.id}/status`)
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          setGenerationProgress(statusData.progress || 0)
          setGenerationMessage(statusData.progressMessage || "Processing...")

          if (statusData.status === "complete" || statusData.status === "failed") {
            clearInterval(pollInterval)
            router.push(`/dashboard/story/${story.id}`)
          }
        }
      }, 2000)

      setTimeout(() => {
        clearInterval(pollInterval)
        router.push(`/dashboard/story/${story.id}`)
      }, 600000)
    } catch (error) {
      console.error("[v0] Error creating story:", error)
      setIsGenerating(false)
      setStep("style")
    }
  }

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">Please log in to create a new story.</p>
        <Button asChild>
          <Link href="/api/auth/login">Log In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      {step === "repo" && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">What code do you want to understand?</h1>
            <p className="mt-2 text-muted-foreground">Paste a GitHub repository URL to get started</p>
          </div>
          <RepoInput onSubmit={handleRepoSubmit} isLoading={isLoadingRepo} error={repoError} />
        </div>
      )}

      {step === "mode" && repoInfo && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Repository Found</h1>
            <p className="mt-2 text-muted-foreground">How would you like to generate your story?</p>
          </div>

          <Card className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Orb colors={["#4ade80", "#22c55e"]} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">
                  {repoInfo.owner}/{repoInfo.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{repoInfo.description}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{repoInfo.language}</span>
                  <span>{repoInfo.stars.toLocaleString()} stars</span>
                </div>
              </div>
            </div>
          </Card>

          <RepoTreePreview owner={repoInfo.owner} repo={repoInfo.name} />

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setStep("style")}
              className="group rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Quick Generate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Let AI analyze the repo and create a comprehensive overview.
              </p>
            </button>

            <button
              onClick={() => setStep("customize")}
              className="group rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Customize My Story</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us what you want to learn. We'll tailor the narrative.
              </p>
            </button>
          </div>

          <Button variant="ghost" onClick={() => setStep("repo")} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Choose Different Repository
          </Button>
        </div>
      )}

      {step === "customize" && repoInfo && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Customize Your Story</h1>
            <p className="mt-2 text-muted-foreground">Chat with AI to define exactly what you want to learn</p>
          </div>

          <IntentChat repoName={repoInfo.name} repoOwner={repoInfo.owner} onIntentComplete={handleIntentComplete} />

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("mode")} className="flex-1 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => setStep("style")} className="flex-1">
              Skip to Style
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "style" && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Choose Your Style</h1>
            <p className="mt-2 text-muted-foreground">Customize how your story sounds</p>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">Quick Presets</label>
            <div className="grid gap-2 sm:grid-cols-4">
              {RECOMMENDED_COMBINATIONS.slice(0, 4).map((combo) => (
                <button
                  key={combo.name}
                  onClick={() => applyRecommendedCombination(combo.config)}
                  className={cn(
                    "rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary",
                    narrativeStyle === combo.config.primary &&
                      secondaryStyle === combo.config.secondary &&
                      "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{combo.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{combo.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">Primary Style</label>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {NARRATIVE_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setNarrativeStyle(style.id)}
                  className={cn(
                    "relative rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary",
                    narrativeStyle === style.id && "border-primary bg-primary/5",
                  )}
                >
                  {narrativeStyle === style.id && (
                    <div className="absolute right-2 top-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <span className="text-2xl">{style.icon}</span>
                  <h4 className="mt-2 font-medium">{style.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium">Add Secondary Style</label>
                <span className="text-xs text-muted-foreground">(Mix two narrative styles)</span>
              </div>
              <Switch
                checked={enableSecondaryPrimaryStyle}
                onCheckedChange={(checked) => {
                  setEnableSecondaryPrimaryStyle(checked)
                  if (!checked) {
                    setSecondaryPrimaryStyle(null)
                  }
                }}
              />
            </div>

            {enableSecondaryPrimaryStyle && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Select a secondary narrative style to blend with {NARRATIVE_STYLES.find(s => s.id === narrativeStyle)?.name}
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {NARRATIVE_STYLES.filter((style) => style.id !== narrativeStyle).map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSecondaryPrimaryStyle(style.id)}
                        className={cn(
                          "relative rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary",
                          secondaryPrimaryStyle === style.id && "border-primary bg-primary/5",
                        )}
                      >
                        {secondaryPrimaryStyle === style.id && (
                          <div className="absolute right-2 top-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <span className="text-xl">{style.icon}</span>
                        <h4 className="mt-1 font-medium text-sm">{style.name}</h4>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {secondaryPrimaryStyle && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Style Mix Ratio</label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <Slider
                          value={[styleMixRatio]}
                          onValueChange={(value) => setStyleMixRatio(value[0])}
                          min={10}
                          max={50}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Primary dominant</span>
                          <span>Balanced blend</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-2 px-4">
                      <span className="text-sm font-medium">
                        {100 - styleMixRatio}% {NARRATIVE_STYLES.find(s => s.id === narrativeStyle)?.name}
                      </span>
                      <span className="text-muted-foreground">+</span>
                      <span className="text-sm font-medium">
                        {styleMixRatio}% {NARRATIVE_STYLES.find(s => s.id === secondaryPrimaryStyle)?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">
              Style Overlay <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {SECONDARY_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSecondaryStyle(secondaryStyle === style.id ? null : style.id)}
                  className={cn(
                    "rounded-lg border border-border bg-card p-2 text-center transition-colors hover:border-primary",
                    secondaryStyle === style.id && "border-primary bg-primary/5",
                  )}
                >
                  <p className="font-medium text-sm">{style.name}</p>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">Voice</label>
            <VoiceBrowser
              selectedVoiceId={voiceId}
              onVoiceSelect={setVoiceId}
            />
          </div>

          <TTSSettings config={ttsConfig.config} onChange={ttsConfig.updateConfig} />

          <div>
            <label className="mb-3 block text-sm font-medium">Story Length</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDuration(option.id)}
                  className={cn(
                    "rounded-lg border border-border bg-card p-2 text-center transition-colors hover:border-primary",
                    duration === option.id && "border-primary bg-primary/5",
                  )}
                >
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.minutes} min</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">Expertise Level</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {EXPERTISE_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setExpertise(level.id)}
                  className={cn(
                    "rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary",
                    expertise === level.id && "border-primary bg-primary/5",
                  )}
                >
                  <p className="font-medium">{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Settings2 className="h-4 w-4" />
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </button>

          {showAdvanced && (
            <div className="space-y-6 rounded-lg border border-border bg-card/50 p-4">
              <div>
                <label className="mb-3 block text-sm font-medium">Content Format</label>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {FORMAT_OPTIONS.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setContentFormat(format.id)}
                      className={cn(
                        "rounded-lg border border-border bg-card p-2 text-center transition-colors hover:border-primary",
                        contentFormat === format.id && "border-primary bg-primary/5",
                      )}
                    >
                      <p className="font-medium text-sm">{format.name}</p>
                      <p className="text-xs text-muted-foreground">{format.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {validationWarnings.length > 0 && (
            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
              <p className="font-medium text-yellow-500">Configuration suggestions:</p>
              <ul className="mt-2 text-sm text-yellow-500/80">
                {validationWarnings.map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          <GenerationEstimate
            targetDurationMinutes={DURATION_OPTIONS.find((d) => d.id === duration)?.minutes || 15}
            expertiseLevel={expertise as "beginner" | "intermediate" | "expert"}
          />

          <div className="rounded-lg border border-border bg-card/50 p-4 space-y-4">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Calendar className="h-4 w-4" />
              {showSchedule ? "Cancel scheduling" : "Schedule for later"}
            </button>
            
            {showSchedule && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("mode")} className="bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSaveDraft} 
              disabled={isSavingDraft || !repoInfo}
              className="bg-transparent"
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </>
              )}
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : showSchedule && scheduledDate && scheduledTime ? (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule & Save
                </>
              ) : (
                <>
                  Generate Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-8">
            <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
              <Orb colors={["#4ade80", "#22c55e"]} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <ShimmeringText text="Creating your tale..." />
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{generationProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{generationMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}
