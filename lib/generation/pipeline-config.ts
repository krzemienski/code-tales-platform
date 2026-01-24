// Master Pipeline Configuration
// Combines all settings for the complete generation pipeline

import {
  OutputFormat,
  ContentLength,
  Tone,
  AudienceLevel,
  ScriptGenerationPath,
  VoiceConfig,
  PodcastConfig,
  FictionConfig,
  ChapterConfig,
  CustomInstructions,
  ProductionSettings,
  DEFAULT_PODCAST_CONFIG,
  DEFAULT_FICTION_CONFIG,
  DEFAULT_CHAPTER_CONFIG,
  DEFAULT_PRODUCTION_SETTINGS,
  DEFAULT_CUSTOM_INSTRUCTIONS,
} from "./modes"

export interface SourceConfig {
  url: string
  type: "github" | "url" | "file" | "text"
  branch?: string
  include_paths?: string[]
  exclude_paths?: string[]
}

export interface PipelineConfig {
  source: SourceConfig
  
  output_format: OutputFormat
  output_path?: string
  
  length: ContentLength
  custom_duration_minutes?: number
  tone: Tone
  audience_level: AudienceLevel
  
  script_generation_path: ScriptGenerationPath
  
  voices: VoiceConfig[]
  auto_assign_voices: boolean
  
  podcast_config?: PodcastConfig
  fiction_config?: FictionConfig
  chapter_config?: ChapterConfig
  
  custom_instructions: CustomInstructions
  
  production_settings: ProductionSettings
  
  claude_model: string
  max_concurrent_agents: number
  agent_temperature: number
  
  chunk_size: number
  enable_caching: boolean
  cache_dir: string
  
  callback_url?: string
}

export const DEFAULT_PIPELINE_CONFIG: Omit<PipelineConfig, "source"> = {
  output_format: OutputFormat.PODCAST,
  length: ContentLength.MEDIUM,
  tone: Tone.CONVERSATIONAL,
  audience_level: AudienceLevel.INTERMEDIATE,
  script_generation_path: ScriptGenerationPath.CLAUDE_AGENTS,
  voices: [],
  auto_assign_voices: true,
  custom_instructions: DEFAULT_CUSTOM_INSTRUCTIONS,
  production_settings: DEFAULT_PRODUCTION_SETTINGS,
  claude_model: "claude-sonnet-4-20250514",
  max_concurrent_agents: 5,
  agent_temperature: 0.7,
  chunk_size: 100000,
  enable_caching: true,
  cache_dir: ".repo_audio_cache",
}

export function createPipelineConfig(
  source: SourceConfig,
  overrides?: Partial<Omit<PipelineConfig, "source">>
): PipelineConfig {
  const config: PipelineConfig = {
    source,
    ...DEFAULT_PIPELINE_CONFIG,
    ...overrides,
  }
  
  if (config.output_format === OutputFormat.PODCAST && !config.podcast_config) {
    config.podcast_config = { ...DEFAULT_PODCAST_CONFIG }
  }
  
  if (config.output_format === OutputFormat.FICTION && !config.fiction_config) {
    config.fiction_config = { ...DEFAULT_FICTION_CONFIG }
  }
  
  if (
    (config.output_format === OutputFormat.AUDIOBOOK || config.output_format === OutputFormat.FICTION) &&
    !config.chapter_config
  ) {
    config.chapter_config = { ...DEFAULT_CHAPTER_CONFIG }
  }
  
  return config
}

export function validatePipelineConfig(config: PipelineConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!config.source?.url) {
    errors.push("Source URL is required")
  }
  
  if (config.length === ContentLength.CUSTOM && !config.custom_duration_minutes) {
    errors.push("Custom duration minutes required when length is CUSTOM")
  }
  
  if (config.custom_duration_minutes !== undefined) {
    if (config.custom_duration_minutes < 1) {
      errors.push("Custom duration must be at least 1 minute")
    }
    if (config.custom_duration_minutes > 180) {
      errors.push("Custom duration cannot exceed 180 minutes")
    }
  }
  
  if (config.agent_temperature < 0 || config.agent_temperature > 1) {
    errors.push("Agent temperature must be between 0 and 1")
  }
  
  if (config.podcast_config?.banter_level !== undefined) {
    if (config.podcast_config.banter_level < 0 || config.podcast_config.banter_level > 1) {
      errors.push("Podcast banter level must be between 0 and 1")
    }
  }
  
  if (config.fiction_config?.dramatization_level !== undefined) {
    if (config.fiction_config.dramatization_level < 0 || config.fiction_config.dramatization_level > 1) {
      errors.push("Fiction dramatization level must be between 0 and 1")
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

export type { 
  OutputFormat, 
  ContentLength, 
  Tone, 
  AudienceLevel, 
  ScriptGenerationPath,
  VoiceConfig,
  PodcastConfig,
  FictionConfig,
  ChapterConfig,
  CustomInstructions,
  ProductionSettings,
} from "./modes"
