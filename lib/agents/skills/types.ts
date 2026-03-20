import { type AgentName, type LogLevel } from "@/lib/agents/log-helper"
import type { ArchitecturePattern, DependencyInfo, ProjectEvolution, StoryBrief } from "@/lib/agents/github"

export interface AgentSkillMetadata {
  name: AgentName
  description: string
  acceptedInputs: string[]
  producedOutputs: string[]
}

export interface AgentSkillLogger {
  log: (action: string, details?: Record<string, any>, level?: LogLevel) => Promise<void>
}

export interface PipelineContext {
  storyId: string
  startTime: number

  story: {
    id: string
    title: string
    narrativeStyle: string
    expertiseLevel: string
    targetDurationMinutes: number
    voiceId?: string | null
    intentId?: string | null
    modelConfig?: Record<string, any> | null
  }

  repo: {
    id: string
    repoOwner: string
    repoName: string
  }

  // Common metadata
  selectedModelId: string
  modelDisplayName: string
  modelMaxTokens: number
  modelTemperature: number
  modelConfigData: {
    modelId: string
    temperature: number
    maxTokens: number
    topP?: number
    frequencyPenalty?: number
    presencePenalty?: number
  }
  promptOptimizations: {
    systemPromptPrefix?: string
    systemPromptSuffix?: string
    userPromptPrefix?: string
    userPromptSuffix?: string
    specialInstructions?: string
  }

  // TTS fields from HEAD
  voiceId: string
  ttsConfig: {
    ttsModelId: string
    outputFormat: string
    stability: number
    similarityBoost: number
    style: number
    useSpeakerBoost: boolean
    language?: string
  }

  intentContext: string

  repoAnalysis?: any
  repoSummary?: string
  script?: string
  chapters?: any[]
  audioUrl?: string
  audioChunks?: string[]
  scriptWordCount?: number
  actualWords?: number
  estimatedDuration?: number

  partial?: boolean
  completedChunks?: number
  totalChunks?: number

  failedAgent?: string
}

export interface AgentSkill {
  metadata: AgentSkillMetadata

  configure(config: Record<string, any>): void

  execute(
    context: PipelineContext,
    logger: AgentSkillLogger,
    updateProgress: (progress: number, message: string, statusOverride?: string) => Promise<void>,
  ): Promise<PipelineContext>
}

export interface ContentSourceAnalysis {
  structure: any[]
  readme: string | null
  languages: Record<string, number>
  mainFiles: string[]
  keyDirectories: string[]
  packageJson: Record<string, unknown> | null
  metadata: {
    stargazers_count?: number
    forks_count?: number
    language?: string
    description?: string
    topics?: string[]
  } | null
  architecturePattern: ArchitecturePattern
  architectureSignals: string[]
  coreFileContents: Record<string, string>
  dependencies: DependencyInfo[]
  evolution: ProjectEvolution | null
  storyBrief: StoryBrief
}

export interface ContentSource {
  name: string
  analyze(): Promise<ContentSourceAnalysis>
  summarize(analysis: ContentSourceAnalysis): string
}
