// Generation Mode Definitions and Configurations
// Enhanced to match Python reference implementation

// =============================================================================
// ENUMS
// =============================================================================

export type GenerationMode = "hybrid" | "elevenlabs_studio"

export enum OutputFormat {
  PODCAST = "podcast",
  AUDIOBOOK = "audiobook",
  FICTION = "fiction",
  DOCUMENTARY = "documentary",
  TUTORIAL = "tutorial",
  TECHNICAL_DEEP_DIVE = "technical",
  EXECUTIVE_SUMMARY = "executive",
  STORYTELLING = "storytelling",
  DEBATE = "debate",
  INTERVIEW = "interview",
}

export enum ContentLength {
  MICRO = "micro",       // 1-3 minutes
  SHORT = "short",       // 3-7 minutes
  MEDIUM = "medium",     // 7-15 minutes
  LONG = "long",         // 15-30 minutes
  EXTENDED = "extended", // 30-60 minutes
  FULL = "full",         // 60+ minutes (audiobook length)
  CUSTOM = "custom",     // User-defined duration
}

export const CONTENT_LENGTH_MINUTES: Record<ContentLength, { min: number; max: number }> = {
  [ContentLength.MICRO]: { min: 1, max: 3 },
  [ContentLength.SHORT]: { min: 3, max: 7 },
  [ContentLength.MEDIUM]: { min: 7, max: 15 },
  [ContentLength.LONG]: { min: 15, max: 30 },
  [ContentLength.EXTENDED]: { min: 30, max: 60 },
  [ContentLength.FULL]: { min: 60, max: 120 },
  [ContentLength.CUSTOM]: { min: 1, max: 180 },
}

export enum Tone {
  PROFESSIONAL = "professional",
  CASUAL = "casual",
  ACADEMIC = "academic",
  HUMOROUS = "humorous",
  DRAMATIC = "dramatic",
  INSPIRATIONAL = "inspirational",
  SERIOUS = "serious",
  CONVERSATIONAL = "conversational",
  STORYTELLING = "storytelling",
  EDUCATIONAL = "educational",
  SATIRICAL = "satirical",
  MYSTERIOUS = "mysterious",
  ENERGETIC = "energetic",
  CALM = "calm",
}

export enum AudienceLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
  GENERAL = "general",
  EXECUTIVE = "executive",
  DEVELOPER = "developer",
  RESEARCHER = "researcher",
}

export enum ScriptGenerationPath {
  CLAUDE_AGENTS = "claude",
  ELEVENLABS_GENFM = "elevenlabs",
  HYBRID = "hybrid",
}

export enum AudioQuality {
  STANDARD = "standard",
  HIGH = "high",
  ULTRA = "ultra",
  ULTRA_LOSSLESS = "ultra_lossless",
}

export enum AgentRole {
  ARCHITECTURE_ANALYST = "architecture_analyst",
  CODE_DEEP_DIVE = "code_deep_dive",
  DOCUMENTATION_ANALYST = "documentation_analyst",
  DEPENDENCY_ANALYST = "dependency_analyst",
  SECURITY_ANALYST = "security_analyst",
  PERFORMANCE_ANALYST = "performance_analyst",
  NARRATIVE_ARCHITECT = "narrative_architect",
  CHARACTER_DESIGNER = "character_designer",
  WORLD_BUILDER = "world_builder",
  DIALOGUE_WRITER = "dialogue_writer",
  SCRIPT_WRITER = "script_writer",
  SCRIPT_REVIEWER = "script_reviewer",
  SCRIPT_EDITOR = "script_editor",
  VOICE_DIRECTOR = "voice_director",
  ORCHESTRATOR = "orchestrator",
  SYNTHESIZER = "synthesizer",
}

// =============================================================================
// INTERFACES
// =============================================================================

export interface VoiceConfig {
  voice_id: string
  name: string
  role: string // narrator, host, guest, character, etc.
  description?: string
  personality_traits: string[]
  speaking_style?: string
}

export interface ChapterConfig {
  auto_detect: boolean
  min_chapter_length: number // words
  max_chapter_length: number // words
  include_chapter_titles: boolean
  chapter_transition_style: "smooth" | "dramatic" | "musical"
}

export interface PodcastConfig {
  num_speakers: number
  speaker_dynamics: "balanced" | "host-led" | "debate"
  include_intro: boolean
  include_outro: boolean
  include_segments: boolean
  segment_transitions: string
  banter_level: number // 0-1, amount of casual banter
}

export interface FictionConfig {
  narrative_style: "first_person" | "third_person" | "omniscient"
  genre: string // sci-fi, fantasy, thriller, mystery, drama
  protagonist_type: string // Who's the main character
  include_dialogue: boolean
  dramatization_level: number // 0-1
  world_building_depth: "minimal" | "moderate" | "extensive"
}

export interface CustomInstructions {
  global_context?: string
  analysis_instructions?: string
  script_instructions?: string
  character_instructions?: string
  style_instructions?: string
  content_focus: string[]
  content_exclude: string[]
  key_themes: string[]
  target_keywords: string[]
  custom_prompts: Partial<Record<AgentRole, string>>
}

export interface ProductionSettings {
  quality: AudioQuality
  model_id: string
  stability: number
  similarity_boost: number
  style: number
  use_speaker_boost: boolean
  output_format: string
}

// =============================================================================
// LEGACY INTERFACES (for backward compatibility)
// =============================================================================

export interface GenerationModeConfig {
  mode: GenerationMode
  scriptModel?: string
  voiceSynthesis?: string
  studioFormat?: "podcast" | "audiobook" | "documentary"
  studioDuration?: "short" | "default" | "long"
  enableSoundEffects: boolean
  enableBackgroundMusic: boolean
}

export interface StudioModeConfig {
  format: "podcast" | "audiobook" | "documentary"
  duration: "short" | "default" | "long"
  hosts: {
    main: string
    guest?: string
  }
  includeMusic?: boolean
  includeSFX?: boolean
  language?: string
  focusAreas?: string[]
  instructionsPrompt?: string
  intro?: string
  outro?: string
  qualityPreset?: "standard" | "high" | "ultra" | "ultra_lossless"
}

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

export const DEFAULT_CONFIGS: Record<string, Partial<GenerationModeConfig>> = {
  podcast: {
    mode: "elevenlabs_studio",
    studioFormat: "podcast",
    studioDuration: "default",
    enableBackgroundMusic: true,
    enableSoundEffects: false,
  },
  documentary: {
    mode: "hybrid",
    scriptModel: "anthropic/claude-sonnet-4",
    voiceSynthesis: "elevenlabs-tts",
    enableBackgroundMusic: false,
    enableSoundEffects: false,
  },
  fiction: {
    mode: "hybrid",
    scriptModel: "anthropic/claude-sonnet-4",
    voiceSynthesis: "elevenlabs-tts",
    enableBackgroundMusic: false,
    enableSoundEffects: false,
  },
  tutorial: {
    mode: "hybrid",
    scriptModel: "openai/gpt-4o",
    voiceSynthesis: "elevenlabs-tts",
    enableBackgroundMusic: false,
    enableSoundEffects: false,
  },
  technical: {
    mode: "hybrid",
    scriptModel: "anthropic/claude-sonnet-4",
    voiceSynthesis: "elevenlabs-tts",
    enableBackgroundMusic: false,
    enableSoundEffects: false,
  },
  debate: {
    mode: "elevenlabs_studio",
    studioFormat: "podcast",
    studioDuration: "default",
    enableBackgroundMusic: false,
    enableSoundEffects: false,
  },
  interview: {
    mode: "elevenlabs_studio",
    studioFormat: "podcast",
    studioDuration: "default",
    enableBackgroundMusic: false,
    enableSoundEffects: false,
  },
  executive: {
    mode: "hybrid",
    scriptModel: "anthropic/claude-sonnet-4",
    voiceSynthesis: "elevenlabs-tts",
    enableBackgroundMusic: false,
    enableSoundEffects: false,
  },
  storytelling: {
    mode: "hybrid",
    scriptModel: "anthropic/claude-sonnet-4",
    voiceSynthesis: "elevenlabs-tts",
    enableBackgroundMusic: true,
    enableSoundEffects: false,
  },
}

export const DEFAULT_PODCAST_CONFIG: PodcastConfig = {
  num_speakers: 2,
  speaker_dynamics: "balanced",
  include_intro: true,
  include_outro: true,
  include_segments: true,
  segment_transitions: "conversational",
  banter_level: 0.3,
}

export const DEFAULT_FICTION_CONFIG: FictionConfig = {
  narrative_style: "third_person",
  genre: "sci-fi",
  protagonist_type: "developer",
  include_dialogue: true,
  dramatization_level: 0.7,
  world_building_depth: "moderate",
}

export const DEFAULT_CHAPTER_CONFIG: ChapterConfig = {
  auto_detect: true,
  min_chapter_length: 500,
  max_chapter_length: 5000,
  include_chapter_titles: true,
  chapter_transition_style: "smooth",
}

export const DEFAULT_PRODUCTION_SETTINGS: ProductionSettings = {
  quality: AudioQuality.HIGH,
  model_id: "eleven_multilingual_v2",
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
  output_format: "mp3_44100_128",
}

export const DEFAULT_CUSTOM_INSTRUCTIONS: CustomInstructions = {
  content_focus: [],
  content_exclude: [],
  key_themes: [],
  target_keywords: [],
  custom_prompts: {},
}

export const VOICE_PRESETS = {
  podcast: {
    host: "21m00Tcm4TlvDq8ikWAM",
    guest: "AZnzlk1XvdvUeBnXmlld",
  },
  documentary: {
    narrator: "ErXwobaYiN019PkySvjV",
  },
  fiction: {
    narrator: "EXAVITQu4vr4xnSDxMaL",
  },
  tutorial: {
    narrator: "pNInz6obpgDQGcFmaJgB",
  },
  technical: {
    narrator: "yoZ06aMxZJJ28mfd3POQ",
  },
  debate: {
    speaker1: "21m00Tcm4TlvDq8ikWAM",
    speaker2: "AZnzlk1XvdvUeBnXmlld",
    moderator: "ErXwobaYiN019PkySvjV",
  },
  interview: {
    interviewer: "21m00Tcm4TlvDq8ikWAM",
    expert: "AZnzlk1XvdvUeBnXmlld",
  },
  executive: {
    narrator: "ErXwobaYiN019PkySvjV",
  },
  storytelling: {
    narrator: "EXAVITQu4vr4xnSDxMaL",
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getRecommendedMode(narrativeStyle: string): GenerationMode {
  if (narrativeStyle === "podcast" || narrativeStyle === "debate" || narrativeStyle === "interview") {
    return "elevenlabs_studio"
  }
  return "hybrid"
}

export function buildGenerationConfig(
  narrativeStyle: string,
  userOverrides?: Partial<GenerationModeConfig>,
): GenerationModeConfig {
  const baseConfig = DEFAULT_CONFIGS[narrativeStyle] || DEFAULT_CONFIGS.documentary

  return {
    mode: userOverrides?.mode || baseConfig.mode || "hybrid",
    scriptModel: userOverrides?.scriptModel || baseConfig.scriptModel,
    voiceSynthesis: userOverrides?.voiceSynthesis || baseConfig.voiceSynthesis,
    studioFormat: userOverrides?.studioFormat || baseConfig.studioFormat,
    studioDuration: userOverrides?.studioDuration || baseConfig.studioDuration,
    enableSoundEffects: userOverrides?.enableSoundEffects ?? baseConfig.enableSoundEffects ?? false,
    enableBackgroundMusic: userOverrides?.enableBackgroundMusic ?? baseConfig.enableBackgroundMusic ?? false,
  }
}

export function getContentLengthRange(length: ContentLength): { min: number; max: number } {
  return CONTENT_LENGTH_MINUTES[length]
}

export function estimateWordCount(minutes: number): number {
  return minutes * 150
}

export function estimateDuration(wordCount: number): number {
  return Math.ceil(wordCount / 150)
}
