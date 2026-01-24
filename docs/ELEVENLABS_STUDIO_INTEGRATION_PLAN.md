# ElevenLabs Studio API Integration Plan

**Version:** 1.0  
**Created:** January 11, 2026  
**Status:** APPROVED FOR IMPLEMENTATION

---

## Executive Summary

This document outlines the comprehensive plan to integrate ElevenLabs Studio API into Code Tales, enabling users to choose between two generation approaches:

1. **Hybrid Mode (Current)**: Claude generates script → ElevenLabs TTS for audio
2. **Studio Mode (New)**: ElevenLabs Studio generates script AND audio (GenFM Podcast or Audiobook)

Users will see real-time pipeline visibility during generation and can compare outputs from both approaches side-by-side.

---

## Part 1: ElevenLabs API Capabilities Overview

### All Available API Endpoints

| Category | Endpoint | Purpose | Current Status |
|----------|----------|---------|----------------|
| **Basic TTS** | `POST /v1/text-to-speech/{voice_id}` | Simple text-to-speech | ✅ IN USE |
| **Studio Projects** | `POST /v1/studio/projects` | Create audiobook/long-form project | ❌ NOT USED |
| **GenFM Podcast** | `POST /v1/studio/create-podcast` | Create AI podcast from content | ❌ NOT USED |
| **Get Project** | `GET /v1/studio/projects/{id}` | Check project status | ❌ NOT USED |
| **List Chapters** | `GET /v1/studio/projects/{id}/chapters` | Get chapter list | ❌ NOT USED |
| **Stream Audio** | `POST /v1/studio/projects/{id}/chapters/{ch_id}/snapshots/{snap_id}/stream` | Download chapter audio | ❌ NOT USED |
| **Voices** | `GET /v1/voices` | List all available voices | ❌ NOT USED |
| **Models** | `GET /v1/models` | List available TTS models | ❌ NOT USED |

---

### Comparison: Basic TTS vs Studio API

| Feature | Basic TTS (Current) | Studio API (To Implement) |
|---------|---------------------|---------------------------|
| **Script Generation** | External (Claude) | Built-in (GenFM LLM) |
| **Audio Generation** | Per-chunk, sequential | Full project with chapters |
| **Multi-Voice** | Manual chunking only | Auto voice assignment |
| **Podcast Format** | Not supported | GenFM conversation mode |
| **Background Music** | Not supported | AI-generated music |
| **Sound Effects** | Not supported | AI-generated SFX |
| **Chapter Management** | Manual parsing | Automatic |
| **Progress Webhooks** | None | Callback URL support |
| **Export Options** | Raw MP3 chunks | Full project export |
| **Cost** | Per-character | Per-character (LLM included) |

---

### ElevenLabs TTS Models

| Model ID | Name | Best For | Latency | Quality |
|----------|------|----------|---------|---------|
| `eleven_flash_v2_5` | Flash v2.5 | Real-time, interactive | ~75ms | Good |
| `eleven_turbo_v2_5` | Turbo v2.5 | Low latency streaming | ~50ms | Good |
| `eleven_multilingual_v2` | Multilingual v2 | High-quality audiobooks | ~250ms | Excellent |
| `eleven_v3` | v3 (Alpha) | Most natural/emotional | Higher | Best |

---

## Part 2: GenFM Podcast API Details

**Endpoint:** `POST /v1/studio/create-podcast`

### Request Parameters

```typescript
interface GenFMPodcastRequest {
  model_id: string;                    // e.g., "eleven_flash_v2_5"
  mode: {
    type: "conversation" | "bulletin"; // conversation = 2 voices, bulletin = 1 voice
    host_voice_id: string;             // Primary voice ID
    guest_voice_id?: string;           // Second voice (conversation only)
  };
  source: {
    type: "text" | "url" | "file";
    content: string;                   // Text content, URL, or file reference
  };
  quality_preset?: "standard" | "high" | "ultra" | "ultra_lossless";
  duration_scale?: "short" | "default" | "long"; // <3min, 3-7min, >7min
  language?: string;                   // ISO 639-1 (e.g., "en")
  intro?: string;                      // Custom intro (max 1500 chars)
  outro?: string;                      // Custom outro (max 1500 chars)
  instructions_prompt?: string;        // Style/tone instructions (max 3000 chars)
  callback_url?: string;               // Webhook for completion notification
  apply_text_normalization?: "auto" | "on" | "off" | "apply_english";
}
```

### Response

```typescript
interface GenFMPodcastResponse {
  project: {
    project_id: string;
    name: string;
    state: "converting" | "default" | "completed";
    chapters: Chapter[];
    // ... metadata
  };
}
```

### Webhook Callbacks

When conversion completes, ElevenLabs sends:

```typescript
// Success
{
  type: "project_conversion_status",
  event_timestamp: 1234567890,
  data: {
    request_id: "...",
    project_id: "21m00Tcm4TlvDq8ikWAM",
    conversion_status: "success",
    project_snapshot_id: "22m00Tcm4TlvDq8ikMAT",
    error_details: null
  }
}

// Error
{
  type: "project_conversion_status",
  event_timestamp: 1234567890,
  data: {
    request_id: "...",
    project_id: "21m00Tcm4TlvDq8ikWAM",
    conversion_status: "error",
    project_snapshot_id: null,
    error_details: "Error details if conversion failed"
  }
}
```

---

## Part 3: Studio Audiobook API Details

**Endpoint:** `POST /v1/studio/projects`

### Request Parameters

```typescript
interface StudioAudiobookRequest {
  name: string;                              // Project name (required)
  default_title_voice_id?: string;           // Voice for headings
  default_paragraph_voice_id?: string;       // Voice for body text
  default_model_id?: string;                 // TTS model
  from_url?: string;                         // Import from URL
  from_document?: File;                      // Upload EPUB/PDF/TXT
  from_content?: string;                     // Plain text content
  quality_preset?: string;                   // Audio quality
  title?: string;                            // Metadata
  author?: string;
  description?: string;
  genres?: string[];
  language?: string;
  isbn_number?: string;
  acx_volume_normalization?: boolean;        // Audible standards
  volume_normalization?: boolean;
  fiction?: boolean;
  mature_content?: boolean;
  callback_url?: string;                     // Webhook
}
```

---

## Part 4: Dual-Mode Architecture

### Mode A: Hybrid (Claude + TTS) - Current

```
┌─────────────────────────────────────────────────────────────────┐
│                     HYBRID MODE PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User Input                                                    │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────┐                   │
│   │ ANALYZER AGENT                          │                   │
│   │ - Fetch GitHub repo                     │                   │
│   │ - Analyze structure                     │                   │
│   │ - Generate summary                      │                   │
│   └─────────────────────────────────────────┘                   │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────┐                   │
│   │ NARRATOR AGENT (Claude)                 │                   │
│   │ - System prompt: STORY_ARCHITECT_PROMPT │                   │
│   │ - Style prompt: FICTION/DOCUMENTARY/... │                   │
│   │ - Expertise modifier                    │                   │
│   │ - Generate full script                  │                   │
│   └─────────────────────────────────────────┘                   │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────┐                   │
│   │ CHAPTER PARSER (Claude Haiku)           │                   │
│   │ - Parse script into chapters            │                   │
│   │ - Calculate timestamps                  │                   │
│   └─────────────────────────────────────────┘                   │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────┐                   │
│   │ SYNTHESIZER AGENT (ElevenLabs TTS)      │                   │
│   │ - POST /v1/text-to-speech/{voice_id}    │                   │
│   │ - Chunk script (max 10,000 chars)       │                   │
│   │ - Voice settings per style              │                   │
│   │ - Upload chunks to Object Storage       │                   │
│   └─────────────────────────────────────────┘                   │
│       │                                                         │
│       ▼                                                         │
│   Completed Story                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

ADVANTAGES:
✅ Full control over script generation prompts
✅ Custom narrative styles (fiction, documentary, tutorial, etc.)
✅ Expertise level modifiers (beginner, intermediate, expert)
✅ Cost-effective for short content
✅ Faster for simple generations
✅ Proven working implementation

DISADVANTAGES:
❌ No multi-voice support (single narrator only)
❌ No background music/SFX
❌ Manual chapter management
❌ No GenFM podcast format (host + guest conversation)
```

### Mode B: Studio (Full ElevenLabs) - To Implement

```
┌─────────────────────────────────────────────────────────────────┐
│                     STUDIO MODE PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User Input                                                    │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────┐                   │
│   │ ANALYZER AGENT                          │                   │
│   │ - Fetch GitHub repo                     │                   │
│   │ - Analyze structure                     │                   │
│   │ - Generate comprehensive summary        │                   │
│   └─────────────────────────────────────────┘                   │
│       │                                                         │
│       ├──────────── PODCAST FORMAT ─────────┐                   │
│       │                                     │                   │
│       ▼                                     ▼                   │
│   ┌─────────────────────┐   ┌─────────────────────┐             │
│   │ GENFM PODCAST       │   │ STUDIO AUDIOBOOK    │             │
│   │ /v1/studio/create-  │   │ /v1/studio/projects │             │
│   │ podcast             │   │                     │             │
│   │                     │   │ - from_content      │             │
│   │ - conversation mode │   │ - auto voice assign │             │
│   │ - host + guest      │   │ - chapter mgmt      │             │
│   │ - 3-7 minute output │   │                     │             │
│   └─────────────────────┘   └─────────────────────┘             │
│       │                             │                           │
│       └──────────┬──────────────────┘                           │
│                  │                                              │
│                  ▼                                              │
│   ┌─────────────────────────────────────────┐                   │
│   │ WEBHOOK HANDLER / POLLING               │                   │
│   │ - Receive callback_url notification     │                   │
│   │ - Or poll GET /studio/projects/{id}     │                   │
│   │ - Wait for conversion complete          │                   │
│   └─────────────────────────────────────────┘                   │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────┐                   │
│   │ DOWNLOAD & STORE                        │                   │
│   │ - Get chapter snapshots                 │                   │
│   │ - Stream audio from snapshots           │                   │
│   │ - Upload to Replit Object Storage       │                   │
│   └─────────────────────────────────────────┘                   │
│       │                                                         │
│       ▼                                                         │
│   Completed Story                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

ADVANTAGES:
✅ GenFM podcast format (host + guest conversation)
✅ Auto-generated script by ElevenLabs LLM
✅ Multi-voice support (different voices for characters)
✅ Background music capability
✅ Sound effects capability
✅ Webhook notifications for async processing
✅ Professional audiobook format with ACX normalization

DISADVANTAGES:
❌ Less control over script content/style
❌ Limited narrative style customization
❌ Depends on ElevenLabs LLM quality
❌ Higher latency (async processing)
❌ Cannot customize prompts as precisely as Claude
```

---

## Part 5: Pipeline Visibility UI Design

### Real-Time Generation Dashboard

When user presses "Generate", they see a live pipeline visualization:

```
┌─────────────────────────────────────────────────────────────────┐
│ Generating: My Code Story                              [Cancel] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Mode: [Hybrid (Claude)] / [Studio (GenFM)]                     │
│                                                                 │
│  Pipeline Stages:                                               │
│  ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐│
│  │Analyzer│ → │Narrator│ → │ Parser │ → │Synthzr │ → │Complete││
│  │   ✓    │   │   ●    │   │   ○    │   │   ○    │   │   ○    ││
│  │  12s   │   │ 45s... │   │        │   │        │   │        ││
│  └────────┘   └────────┘   └────────┘   └────────┘   └────────┘│
│                                                                 │
│  Current Stage Details:                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Narrator Agent (Claude Sonnet 4)                         │   │
│  │                                                          │   │
│  │ Status: Generating script...                             │   │
│  │ Model: claude-sonnet-4-20250514                          │   │
│  │ Style: fiction | Expertise: expert | Target: 10 min      │   │
│  │                                                          │   │
│  │ [▶ View System Prompt]  [▶ View User Prompt]             │   │
│  │ [▶ View Response (streaming...)]                         │   │
│  │                                                          │   │
│  │ Token Usage: 1,245 input → 2,100 output (streaming)      │   │
│  │ Estimated Cost: $0.012                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Live Log Stream:                                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 14:32:01 [Analyzer] Fetching mikeyobrien/ralph-orchestr  │   │
│  │ 14:32:03 [Analyzer] ✓ Repository analyzed (372 chars)    │   │
│  │ 14:32:04 [Narrator] Starting script generation...        │   │
│  │ 14:32:05 [Narrator] Using style: fiction, expertise: exp │   │
│  │ 14:32:45 [Narrator] Script generated (1,500 words)       │   │
│  │ 14:32:46 [Parser] Parsing chapters...                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Overall Progress: ████████████░░░░░░░░░ 55%                    │
│  Elapsed: 2m 14s | Est. Remaining: 1m 50s                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Comparison View (Side-by-Side)

When user selects "Compare Both Modes":

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Comparison: Hybrid vs Studio                                    [Close]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐   ┌─────────────────────────────┐          │
│  │     HYBRID MODE             │   │     STUDIO MODE             │          │
│  │     (Claude + TTS)          │   │     (GenFM Podcast)         │          │
│  ├─────────────────────────────┤   ├─────────────────────────────┤          │
│  │ Status: Completed ✓         │   │ Status: Converting... ●     │          │
│  │ Duration: 10:13             │   │ Duration: ~5-7 min          │          │
│  │ Words: 1,532                │   │ Format: Conversation        │          │
│  │ Cost: $0.045                │   │ Cost: $0.032                │          │
│  │                             │   │                             │          │
│  │ [▶ Play]  [📄 Script]       │   │ [○ Waiting...]              │          │
│  │                             │   │                             │          │
│  │ Chapters:                   │   │ Chapters:                   │          │
│  │ 1. Introduction (0:00)      │   │ (Pending...)                │          │
│  │ 2. Architecture (1:30)      │   │                             │          │
│  │ 3. Core Modules (3:45)      │   │                             │          │
│  └─────────────────────────────┘   └─────────────────────────────┘          │
│                                                                             │
│  Metrics Comparison:                                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Metric              │ Hybrid            │ Studio            │ Winner  │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │ Generation Time     │ 2m 14s            │ 3m 45s            │ Hybrid  │ │
│  │ Script Control      │ Full (Claude)     │ Limited (GenFM)   │ Hybrid  │ │
│  │ Audio Quality       │ Standard TTS      │ GenFM optimized   │ Studio  │ │
│  │ Multi-Voice         │ No                │ Yes (2 voices)    │ Studio  │ │
│  │ Cost                │ $0.045            │ $0.032            │ Studio  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 6: Implementation Phases

### Phase 1: Studio API Backend Integration (16h)

| Task | Description | Files |
|------|-------------|-------|
| 1.1 | Update `elevenlabs-studio.ts` with correct API endpoints | `lib/generation/elevenlabs-studio.ts` |
| 1.2 | Add GenFM podcast creation function | `lib/generation/elevenlabs-studio.ts` |
| 1.3 | Add audiobook project creation function | `lib/generation/elevenlabs-studio.ts` |
| 1.4 | Add chapter snapshot streaming function | `lib/generation/elevenlabs-studio.ts` |
| 1.5 | Add webhook handler for conversion status | `app/api/webhooks/elevenlabs/route.ts` |
| 1.6 | Create new generation route for Studio mode | `app/api/stories/generate-studio/route.ts` |
| 1.7 | Update types for Studio API | `lib/types.ts` |

### Phase 2: Generation Mode Selection UI (12h)

| Task | Description | Files |
|------|-------------|-------|
| 2.1 | Create mode selector component | `components/generation-mode-selector.tsx` |
| 2.2 | Add Studio options UI (GenFM vs Audiobook) | `components/studio-options.tsx` |
| 2.3 | Add voice pair selector for GenFM | `components/voice-pair-selector.tsx` |
| 2.4 | Update tale creation wizard | `app/dashboard/new/page.tsx` |
| 2.5 | Add comparison mode toggle | `components/compare-mode-toggle.tsx` |

### Phase 3: Pipeline Visibility UI (20h)

| Task | Description | Files |
|------|-------------|-------|
| 3.1 | Create stage_metrics database table | `lib/db/schema.ts` + migration |
| 3.2 | Add stage logging to generation routes | `app/api/stories/generate/route.ts` |
| 3.3 | Create SSE endpoint for live updates | `app/api/stories/[id]/stream/route.ts` |
| 3.4 | Create pipeline dashboard component | `components/pipeline-dashboard.tsx` |
| 3.5 | Create stage timeline component | `components/pipeline/stage-timeline.tsx` |
| 3.6 | Create prompt viewer component | `components/pipeline/prompt-viewer.tsx` |
| 3.7 | Create live log viewer component | `components/pipeline/live-log.tsx` |
| 3.8 | Create metrics panel component | `components/pipeline/metrics-panel.tsx` |
| 3.9 | Add token/cost tracking | `lib/generation/metrics.ts` |
| 3.10 | Update story processing page | `app/story/[id]/processing/page.tsx` |

### Phase 4: Comparison Feature (12h)

| Task | Description | Files |
|------|-------------|-------|
| 4.1 | Create comparison generation API | `app/api/stories/generate-compare/route.ts` |
| 4.2 | Create side-by-side comparison UI | `components/comparison-view.tsx` |
| 4.3 | Add metrics comparison table | `components/comparison-metrics.tsx` |
| 4.4 | Add A/B playback controls | `components/ab-player.tsx` |

### Phase 5: Voice & Model Configuration (8h)

| Task | Description | Files |
|------|-------------|-------|
| 5.1 | Fetch and cache available voices | `lib/elevenlabs/voices.ts` |
| 5.2 | Add voice preview player | `components/voice-preview.tsx` |
| 5.3 | Add model selector with descriptions | `components/model-selector.tsx` |
| 5.4 | Add quality preset selector | `components/quality-preset.tsx` |

---

## Part 7: Database Schema Updates

```sql
-- New table for stage metrics (pipeline visibility)
CREATE TABLE IF NOT EXISTS stage_metrics (
    id SERIAL PRIMARY KEY,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    stage_name VARCHAR(50) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_ms INTEGER,
    status VARCHAR(20) DEFAULT 'running',
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost_estimate DECIMAL(10,6),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add generation mode columns to stories
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS generation_mode VARCHAR(20) DEFAULT 'hybrid',
ADD COLUMN IF NOT EXISTS studio_project_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS comparison_story_id UUID,
ADD COLUMN IF NOT EXISTS generation_metrics JSONB;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_stage_metrics_story ON stage_metrics(story_id);
CREATE INDEX IF NOT EXISTS idx_stage_metrics_stage ON stage_metrics(stage_name);
```

---

## Part 8: New API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/stories/generate-studio` | POST | Generate using ElevenLabs Studio API |
| `/api/stories/generate-compare` | POST | Generate with both modes for comparison |
| `/api/stories/[id]/stream` | GET | SSE for live pipeline updates |
| `/api/stories/[id]/stages` | GET | Get stage metrics for a story |
| `/api/webhooks/elevenlabs` | POST | Handle ElevenLabs callback notifications |
| `/api/voices` | GET | List available ElevenLabs voices |
| `/api/models` | GET | List available TTS models |

---

## Part 9: User Configuration Options

```typescript
interface GenerationConfig {
  // Mode selection
  mode: "hybrid" | "studio_podcast" | "studio_audiobook" | "compare";
  
  // Common settings
  voiceId: string;
  modelId: string;
  qualityPreset: "standard" | "high" | "ultra" | "ultra_lossless";
  
  // Hybrid mode settings (Claude + TTS)
  hybridSettings?: {
    scriptModel: "claude-sonnet-4" | "claude-3-5-haiku";
    narrativeStyle: "fiction" | "documentary" | "tutorial" | "podcast" | "technical";
    expertiseLevel: "beginner" | "intermediate" | "expert";
    targetDurationMinutes: number;
  };
  
  // Studio podcast settings (GenFM)
  podcastSettings?: {
    hostVoiceId: string;
    guestVoiceId?: string;
    durationScale: "short" | "default" | "long";
    instructionsPrompt?: string;
    intro?: string;
    outro?: string;
  };
  
  // Studio audiobook settings
  audiobookSettings?: {
    titleVoiceId?: string;
    paragraphVoiceId: string;
    acxNormalization: boolean;
    volumeNormalization: boolean;
  };
}
```

---

## Part 10: Voice Reference

### Recommended Voices by Use Case

| Voice | ID | Best For |
|-------|----|----|
| Rachel | `21m00Tcm4TlvDq8ikWAM` | General narration, tutorials |
| Domi | `AZnzlk1XvdvUeBnXmlld` | Podcast guest (female) |
| Bella | `EXAVITQu4vr4xnSDxMaL` | Fiction narration |
| Antoni | `ErXwobaYiN019PkySvjV` | Documentary narration |
| Josh | `TxGEqnHWrfWFTfGW9XjX` | Young male narrator |
| Arnold | `VR6AewLTigWG4xSOukaG` | Deep voice, dramatic |
| Adam | `pNInz6obpgDQGcFmaJgB` | Tutorial, instructional |
| Sam | `yoZ06aMxZJJ28mfd3POQ` | Technical content |

### Voice Pairings for Podcasts

| Style | Host Voice | Guest Voice |
|-------|------------|-------------|
| Tech Discussion | Rachel | Domi |
| Documentary | Antoni | Josh |
| Casual Chat | Adam | Bella |

---

## Part 11: Success Metrics

| Metric | Target |
|--------|--------|
| Hybrid mode generation time | < 3 minutes for 10-min story |
| Studio mode generation time | < 5 minutes for podcast |
| Pipeline visibility update latency | < 500ms |
| User comparison engagement | > 60% try both modes |
| Error rate | < 5% generation failures |

---

## Part 12: Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ElevenLabs Studio API access denied | Medium | High | Apply for API access early, maintain TTS fallback |
| GenFM quality inconsistent | Medium | Medium | Allow instructions prompt customization |
| Webhook delivery unreliable | Low | Medium | Implement polling fallback |
| Cost overruns | Medium | Medium | Add cost estimates before generation |
| Long conversion times | Medium | Low | Show accurate progress, background processing |

---

## Part 13: Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Studio API Backend | 1 week | ElevenLabs API access |
| Phase 2: Mode Selection UI | 1 week | Phase 1 complete |
| Phase 3: Pipeline Visibility | 1.5 weeks | Phase 1 complete |
| Phase 4: Comparison Feature | 1 week | Phase 2 & 3 complete |
| Phase 5: Voice/Model Config | 0.5 weeks | Phase 2 complete |

**Total Estimated Time: 5 weeks**

---

## Appendix A: Current Implementation Status

### Files Currently Using ElevenLabs

| File | Usage | API Endpoint |
|------|-------|--------------|
| `app/api/stories/generate/route.ts` | Main generation | `/v1/text-to-speech/{voice_id}` |
| `app/api/stories/regenerate-audio/route.ts` | Retry audio | `/v1/text-to-speech/{voice_id}` |
| `app/api/voices/preview/route.ts` | Voice samples | `/v1/text-to-speech/{voice_id}` |
| `lib/generation/elevenlabs-studio.ts` | **SKELETON ONLY** | Not connected |

### What Needs to Change

1. **`lib/generation/elevenlabs-studio.ts`** - Complete implementation with correct endpoints
2. **`app/api/stories/generate/route.ts`** - Add mode branching
3. **New webhook route** - Handle ElevenLabs callbacks
4. **New SSE route** - Pipeline visibility streaming
5. **Database schema** - Add stage_metrics table
6. **UI components** - Mode selector, pipeline dashboard, comparison view
