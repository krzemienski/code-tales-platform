// ElevenLabs Studio API Integration for Full Production Pipeline
// Documentation: https://elevenlabs.io/docs/api-reference/studio

import type { StudioModeConfig } from "./modes"

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1"

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface StudioProject {
  project_id: string
  name: string
  state: "converting" | "default" | "ready" | "completed"
  created_at: string
  chapters?: StudioChapter[]
  metadata?: {
    title?: string
    author?: string
    description?: string
    genres?: string[]
    language?: string
  }
  quality_preset?: string
  can_be_downloaded?: boolean
  project_snapshot_id?: string
}

export interface StudioChapter {
  chapter_id: string
  name: string
  state: "converting" | "default" | "ready"
  conversion_progress?: number
  snapshots?: ChapterSnapshot[]
}

export interface ChapterSnapshot {
  chapter_snapshot_id: string
  project_snapshot_id: string
  created_at: string
}

export interface GenFMPodcastRequest {
  model_id: string
  mode: {
    type: "conversation"
    conversation: {
      host_voice_id: string
      guest_voice_id: string
    }
  } | {
    type: "bulletin"
    bulletin: {
      voice_id: string
    }
  }
  source: {
    type: "text"
    text: string
  } | {
    type: "url"
    url: string
  }
  quality_preset?: "standard" | "high" | "ultra" | "ultra_lossless"
  duration_scale?: "short" | "default" | "long"
  language?: string
  intro?: string
  outro?: string
  instructions_prompt?: string
  highlights?: string[]
  callback_url?: string
  apply_text_normalization?: "auto" | "on" | "off" | "apply_english"
}

export interface GenFMPodcastResponse {
  project: StudioProject
}

export interface AudiobookProjectRequest {
  name: string
  default_title_voice_id?: string
  default_paragraph_voice_id?: string
  default_model_id?: string
  from_url?: string
  from_content?: string
  quality_preset?: string
  title?: string
  author?: string
  description?: string
  genres?: string[]
  language?: string
  isbn_number?: string
  acx_volume_normalization?: boolean
  volume_normalization?: boolean
  fiction?: boolean
  mature_content?: boolean
  callback_url?: string
}

export interface ElevenLabsVoice {
  voice_id: string
  name: string
  category: string
  description?: string
  preview_url?: string
  labels?: Record<string, string>
}

export interface ElevenLabsModel {
  model_id: string
  name: string
  description: string
  can_do_text_to_speech: boolean
  can_be_finetuned: boolean
  languages?: { language_id: string; name: string }[]
}

// Webhook callback types
export interface WebhookProjectConversion {
  type: "project_conversion_status"
  event_timestamp: number
  data: {
    request_id: string
    project_id: string
    conversion_status: "success" | "error"
    project_snapshot_id?: string
    error_details?: string
  }
}

export interface WebhookChapterConversion {
  type: "chapter_conversion_status"
  event_timestamp: number
  data: {
    request_id: string
    project_id: string
    chapter_id: string
    conversion_status: "success" | "error"
    chapter_snapshot_id?: string
    error_details?: string
  }
}

export type WebhookEvent = WebhookProjectConversion | WebhookChapterConversion

// =====================================================
// API FUNCTIONS
// =====================================================

function getApiKey(): string {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured")
  }
  return apiKey
}

// Create GenFM podcast from content
export async function createGenFMPodcast(
  content: string,
  config: StudioModeConfig,
  callbackUrl?: string,
): Promise<StudioProject> {
  const apiKey = getApiKey()

  const mode = config.hosts.guest
    ? {
        type: "conversation" as const,
        conversation: {
          host_voice_id: config.hosts.main,
          guest_voice_id: config.hosts.guest,
        },
      }
    : {
        type: "bulletin" as const,
        bulletin: {
          voice_id: config.hosts.main,
        },
      }

  const request: GenFMPodcastRequest = {
    model_id: "eleven_flash_v2_5",
    mode,
    source: {
      type: "text",
      text: content,
    },
    quality_preset: config.qualityPreset || "high",
    duration_scale: config.duration || "default",
    language: config.language || "en",
    intro: config.intro,
    outro: config.outro,
    instructions_prompt: config.instructionsPrompt,
    callback_url: callbackUrl,
    apply_text_normalization: "auto",
  }

  const response = await fetch(`${ELEVENLABS_API_BASE}/studio/podcasts`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create GenFM podcast: ${response.status} - ${error}`)
  }

  const data: GenFMPodcastResponse = await response.json()
  return data.project
}

// Create Studio audiobook project
export async function createAudiobookProject(
  name: string,
  content: string,
  config: StudioModeConfig,
  callbackUrl?: string,
): Promise<StudioProject> {
  const apiKey = getApiKey()

  const request: AudiobookProjectRequest = {
    name,
    from_content: content,
    default_paragraph_voice_id: config.hosts.main,
    default_title_voice_id: config.hosts.main,
    default_model_id: "eleven_multilingual_v2",
    quality_preset: config.qualityPreset || "high",
    language: config.language || "en",
    fiction: true,
    volume_normalization: true,
    callback_url: callbackUrl,
  }

  const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create audiobook project: ${response.status} - ${error}`)
  }

  return response.json()
}

// Create a Studio project based on format
export async function createStudioProject(
  name: string,
  content: string,
  config: StudioModeConfig,
  callbackUrl?: string,
): Promise<StudioProject> {
  if (config.format === "podcast") {
    return createGenFMPodcast(content, config, callbackUrl)
  }
  return createAudiobookProject(name, content, config, callbackUrl)
}

// Get project status
export async function getProjectStatus(projectId: string): Promise<StudioProject> {
  const apiKey = getApiKey()

  const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects/${projectId}`, {
    headers: {
      "xi-api-key": apiKey,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get project status: ${response.status} - ${error}`)
  }

  return response.json()
}

// List all projects
export async function listProjects(): Promise<{ projects: StudioProject[] }> {
  const apiKey = getApiKey()

  const response = await fetch(`${ELEVENLABS_API_BASE}/studio/projects`, {
    headers: {
      "xi-api-key": apiKey,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to list projects: ${response.status} - ${error}`)
  }

  return response.json()
}

// Get chapters for a project
export async function getProjectChapters(
  projectId: string,
): Promise<{ chapters: StudioChapter[] }> {
  const apiKey = getApiKey()

  const response = await fetch(
    `${ELEVENLABS_API_BASE}/studio/projects/${projectId}/chapters`,
    {
      headers: {
        "xi-api-key": apiKey,
      },
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get project chapters: ${response.status} - ${error}`)
  }

  return response.json()
}

// Get chapter snapshots
export async function getChapterSnapshots(
  projectId: string,
  chapterId: string,
): Promise<ChapterSnapshot[]> {
  const apiKey = getApiKey()

  const response = await fetch(
    `${ELEVENLABS_API_BASE}/studio/projects/${projectId}/chapters/${chapterId}/snapshots`,
    {
      headers: {
        "xi-api-key": apiKey,
      },
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get chapter snapshots: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.snapshots || []
}

// Stream chapter audio from snapshot
export async function streamChapterAudio(
  projectId: string,
  chapterId: string,
  snapshotId: string,
): Promise<ArrayBuffer> {
  const apiKey = getApiKey()

  const response = await fetch(
    `${ELEVENLABS_API_BASE}/studio/projects/${projectId}/chapters/${chapterId}/snapshots/${snapshotId}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to stream chapter audio: ${response.status} - ${error}`)
  }

  return response.arrayBuffer()
}

// Convert a chapter to audio
export async function convertChapter(projectId: string, chapterId: string): Promise<void> {
  const apiKey = getApiKey()

  const response = await fetch(
    `${ELEVENLABS_API_BASE}/studio/projects/${projectId}/chapters/${chapterId}/convert`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to convert chapter: ${response.status} - ${error}`)
  }
}

// Poll for project completion (with timeout)
export async function waitForProjectCompletion(
  projectId: string,
  maxWaitMs = 600000, // 10 minutes default
  pollIntervalMs = 5000,
  onProgress?: (project: StudioProject) => void,
): Promise<StudioProject> {
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitMs) {
    const project = await getProjectStatus(projectId)

    onProgress?.(project)

    if (project.state === "ready" || project.state === "completed" || project.can_be_downloaded) {
      return project
    }

    if (project.state === "default" && project.can_be_downloaded) {
      return project
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
  }

  throw new Error(`Studio project timed out after ${maxWaitMs}ms`)
}

// Download all chapter audio for a completed project
export async function downloadProjectAudio(
  projectId: string,
): Promise<{ chapterId: string; audio: ArrayBuffer }[]> {
  const { chapters } = await getProjectChapters(projectId)
  const audioChunks: { chapterId: string; audio: ArrayBuffer }[] = []

  for (const chapter of chapters) {
    if (chapter.state === "ready" || chapter.state === "default") {
      try {
        const snapshots = await getChapterSnapshots(projectId, chapter.chapter_id)
        
        if (snapshots && snapshots.length > 0) {
          const latestSnapshot = snapshots[snapshots.length - 1]
          const audio = await streamChapterAudio(
            projectId,
            chapter.chapter_id,
            latestSnapshot.chapter_snapshot_id,
          )
          audioChunks.push({ chapterId: chapter.chapter_id, audio })
        }
      } catch (error) {
        console.error(`Failed to download chapter ${chapter.chapter_id}:`, error)
      }
    }
  }

  return audioChunks
}

// =====================================================
// VOICE & MODEL DISCOVERY
// =====================================================

export async function listVoices(): Promise<{ voices: ElevenLabsVoice[] }> {
  const apiKey = getApiKey()
  const allVoices: ElevenLabsVoice[] = []

  const accountVoicesResponse = await fetch(
    `${ELEVENLABS_API_BASE}/voices?show_legacy=true`,
    {
      headers: { "xi-api-key": apiKey },
    },
  )

  if (!accountVoicesResponse.ok) {
    const error = await accountVoicesResponse.text()
    throw new Error(`Failed to list voices: ${accountVoicesResponse.status} - ${error}`)
  }

  const accountData: { voices: ElevenLabsVoice[] } = await accountVoicesResponse.json()
  allVoices.push(...accountData.voices)

  const seenIds = new Set(allVoices.map(v => v.voice_id))

  let nextCursor: string | undefined
  const MAX_LIBRARY_PAGES = 100
  for (let page = 0; page < MAX_LIBRARY_PAGES; page++) {
    const params = new URLSearchParams({
      page_size: "100",
      sort: "trending",
    })
    if (nextCursor) {
      params.set("next_cursor", nextCursor)
    }

    const libraryResponse = await fetch(
      `${ELEVENLABS_API_BASE}/shared-voices?${params.toString()}`,
      {
        headers: { "xi-api-key": apiKey },
      },
    )

    if (!libraryResponse.ok) break

    const libraryData: {
      voices: Array<{
        voice_id: string
        name: string
        category: string
        description: string
        preview_url: string
        labels: Record<string, string>
      }>
      next_cursor?: string
      has_more?: boolean
    } = await libraryResponse.json()

    for (const v of libraryData.voices) {
      if (!seenIds.has(v.voice_id)) {
        seenIds.add(v.voice_id)
        allVoices.push({
          voice_id: v.voice_id,
          name: v.name,
          category: v.category || "community",
          description: v.description || "",
          preview_url: v.preview_url || "",
          labels: v.labels || {},
        })
      }
    }

    nextCursor = libraryData.next_cursor
    if (!libraryData.has_more || !nextCursor) break
  }

  return { voices: allVoices }
}

// List available models
export async function listModels(): Promise<ElevenLabsModel[]> {
  const apiKey = getApiKey()

  const response = await fetch(`${ELEVENLABS_API_BASE}/models`, {
    headers: {
      "xi-api-key": apiKey,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to list models: ${response.status} - ${error}`)
  }

  return response.json()
}

// Get voice sample preview URL
export async function getVoicePreview(voiceId: string): Promise<string | null> {
  const { voices } = await listVoices()
  const voice = voices.find((v) => v.voice_id === voiceId)
  return voice?.preview_url || null
}

// =====================================================
// RECOMMENDED VOICE PAIRS
// =====================================================

export const RECOMMENDED_VOICE_PAIRS = {
  tech_podcast: {
    host: { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
    guest: { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
    description: "Professional tech discussion with female voices",
  },
  documentary: {
    host: { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
    guest: { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
    description: "Documentary-style narration with male voices",
  },
  casual_chat: {
    host: { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
    guest: { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
    description: "Casual, friendly conversation style",
  },
  educational: {
    host: { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam" },
    guest: { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
    description: "Educational content with expert tone",
  },
}

// =====================================================
// QUALITY PRESETS
// =====================================================

export const QUALITY_PRESETS = {
  standard: {
    id: "standard",
    name: "Standard",
    description: "128kbps, 44.1kHz - Good for most uses",
    cost: "1x",
  },
  high: {
    id: "high",
    name: "High Quality",
    description: "192kbps, 44.1kHz - Improved audio quality",
    cost: "1.2x",
  },
  ultra: {
    id: "ultra",
    name: "Ultra Quality",
    description: "192kbps, 44.1kHz - Highest quality processing",
    cost: "1.5x",
  },
  ultra_lossless: {
    id: "ultra_lossless",
    name: "Ultra Lossless",
    description: "705.6kbps, 44.1kHz - Lossless quality for archival",
    cost: "2x",
  },
}

// =====================================================
// DURATION PRESETS
// =====================================================

export const DURATION_PRESETS = {
  short: {
    id: "short",
    name: "Short",
    description: "Under 3 minutes - Quick overview",
  },
  default: {
    id: "default",
    name: "Standard",
    description: "3-7 minutes - Balanced coverage",
  },
  long: {
    id: "long",
    name: "Long",
    description: "7+ minutes - Detailed exploration",
  },
}
