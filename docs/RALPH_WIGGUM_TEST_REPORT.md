# Code Tales - Ralph Wiggum Test Stories Report

**Generated:** January 9, 2026  
**Test Repository:** mikeyobrien/ralph-orchestrator  
**Repository ID:** 8ffc7bb5-fd88-40a4-9fb6-f2b9172b1833

## Executive Summary

Successfully generated 5 Ralph Wiggum themed audio stories using the Code Tales platform. All stories completed with working audio playback, demonstrating the full pipeline from GitHub repository analysis through AI script generation to ElevenLabs audio synthesis.

**Total Audio Content Generated:** 55.5 minutes (3,331 seconds)

---

## Test Stories Overview

| # | Story Title | Style | Duration | Status | Audio Chunks |
|---|-------------|-------|----------|--------|--------------|
| 1 | Ralph Wiggum Comedy Hour | Comedy | 12.2 min | Completed | 2 |
| 2 | The Adventures of Ralph Wiggum | Fiction | 14.0 min | Completed | 2 |
| 3 | Ralph Wiggum: A Documentary | Documentary | 9.7 min | Completed | 2 |
| 4 | Learning Code with Ralph Wiggum | Tutorial | 9.9 min | Completed | 2 |
| 5 | The Ralph Wiggum Podcast | Documentary | 9.7 min | Completed | 2 |

---

## Detailed Story Information

### 1. Ralph Wiggum Comedy Hour

- **Story ID:** `0850462f-2732-4d4a-b57a-5fa52a88f6bf`
- **Narrative Style:** Comedy
- **Duration:** 733 seconds (12.2 minutes)
- **Play Count:** 2
- **TTS Model:** eleven_flash_v2_5
- **Script Model:** claude-opus-4-20250514 (auto-selected Sonnet 4)
- **Public URL:** `/story/0850462f-2732-4d4a-b57a-5fa52a88f6bf`

**Audio Files:**
```
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/0850462f-2732-4d4a-b57a-5fa52a88f6bf/chunk_001.mp3
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/0850462f-2732-4d4a-b57a-5fa52a88f6bf/chunk_002.mp3
```

---

### 2. The Adventures of Ralph Wiggum

- **Story ID:** `3eee995e-7c9e-457d-9233-be8a5cf8b9a4`
- **Narrative Style:** Fiction
- **Duration:** 841 seconds (14.0 minutes)
- **Play Count:** 1
- **TTS Model:** eleven_multilingual_v2
- **Script Model:** claude-opus-4-20250514 (auto-selected Sonnet 4)
- **Public URL:** `/story/3eee995e-7c9e-457d-9233-be8a5cf8b9a4`

**Audio Files:**
```
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/3eee995e-7c9e-457d-9233-be8a5cf8b9a4/chunk_001.mp3
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/3eee995e-7c9e-457d-9233-be8a5cf8b9a4/chunk_002.mp3
```

---

### 3. Ralph Wiggum: A Documentary

- **Story ID:** `319faaba-713e-4577-b8be-c736200f0bee`
- **Narrative Style:** Documentary
- **Duration:** 582 seconds (9.7 minutes)
- **Play Count:** 1
- **TTS Model:** eleven_flash_v2_5 (via TTS mode)
- **Script Model:** claude-opus-4-20250514 (auto-selected Sonnet 4)
- **Public URL:** `/story/319faaba-713e-4577-b8be-c736200f0bee`
- **Studio Config:** Documentary format, Host voice: 21m00Tcm4TlvDq8ikWAM

**Audio Files:**
```
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/319faaba-713e-4577-b8be-c736200f0bee/chunk_001.mp3
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/319faaba-713e-4577-b8be-c736200f0bee/chunk_002.mp3
```

---

### 4. Learning Code with Ralph Wiggum

- **Story ID:** `42c33b4d-53c4-4156-a994-4e64098386a1`
- **Narrative Style:** Tutorial
- **Duration:** 595 seconds (9.9 minutes)
- **Play Count:** 1
- **TTS Model:** eleven_turbo_v2_5
- **Script Model:** claude-sonnet-4-20250514 (explicitly set)
- **Public URL:** `/story/42c33b4d-53c4-4156-a994-4e64098386a1`

**Audio Files:**
```
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/42c33b4d-53c4-4156-a994-4e64098386a1/chunk_001.mp3
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/42c33b4d-53c4-4156-a994-4e64098386a1/chunk_002.mp3
```

---

### 5. The Ralph Wiggum Podcast

- **Story ID:** `3acd3b17-f7d1-4ddc-a782-fc2fd9b36069`
- **Narrative Style:** Documentary
- **Duration:** 580 seconds (9.7 minutes)
- **Play Count:** 1
- **TTS Model:** eleven_flash_v2_5 (via TTS mode)
- **Script Model:** claude-opus-4-20250514 (auto-selected Sonnet 4)
- **Public URL:** `/story/3acd3b17-f7d1-4ddc-a782-fc2fd9b36069`
- **Studio Config:** Podcast format, Background music enabled

**Audio Files:**
```
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/3acd3b17-f7d1-4ddc-a782-fc2fd9b36069/chunk_001.mp3
/replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304/.private/audio/3acd3b17-f7d1-4ddc-a782-fc2fd9b36069/chunk_002.mp3
```

---

## System Architecture Flow

### 1. Story Generation Pipeline

```
[User Request] 
    ↓
[POST /api/stories/generate]
    ↓
[Fetch Story + Repository from PostgreSQL]
    ↓
[Analyze GitHub Repository]
    ↓
[Generate Script with Claude Sonnet 4]
    ├── Input: Repo analysis, narrative style, target duration
    ├── Output: Narrative script with chapters
    └── Token usage tracked for telemetry
    ↓
[Parse Chapters from Script]
    ↓
[Split Script into Chunks (max 10KB each)]
    ↓
[ElevenLabs TTS Synthesis]
    ├── Process each chunk sequentially
    ├── Model: eleven_flash_v2_5 / eleven_multilingual_v2 / eleven_turbo_v2_5
    └── Generate MP3 audio
    ↓
[Upload to Replit Object Storage]
    ├── Path: /.private/audio/{storyId}/chunk_XXX.mp3
    └── Files stored privately (no public access)
    ↓
[Update Story Status in PostgreSQL]
    ├── status: 'completed'
    ├── audio_url: first chunk path
    ├── audio_chunks: array of all chunk paths
    └── actual_duration_seconds: calculated from chunks
```

### 2. Audio Playback Flow

```
[Story Player Component]
    ↓
[Convert Storage Paths to API URLs]
    ├── Input: /replit-objstore-.../chunk_001.mp3
    └── Output: /api/audio?path=...
    ↓
[GET /api/audio?path=...]
    ↓
[Fetch from Replit Object Storage]
    ├── getFileStream(path)
    └── Stream file content
    ↓
[Return Audio with Headers]
    ├── Content-Type: audio/mpeg
    ├── Accept-Ranges: bytes
    └── Cache-Control: public, max-age=31536000
    ↓
[HTML5 Audio Element Playback]
    ├── Multi-chunk support (Part 1 of 2, etc.)
    ├── Automatic chunk progression
    └── Progress tracking and saving
```

---

## Key Technical Details

### AI Integration
- **Provider:** Anthropic (via AI SDK)
- **Model:** claude-sonnet-4-20250514
- **Token Tracking:** inputTokens, outputTokens, cachedInputTokens

### Audio Synthesis
- **Provider:** ElevenLabs TTS API
- **Models Used:**
  - eleven_flash_v2_5 (fast synthesis)
  - eleven_multilingual_v2 (multi-language support)
  - eleven_turbo_v2_5 (balanced speed/quality)
- **Chunking:** Scripts split at ~10KB to avoid API limits

### Storage
- **Provider:** Replit Object Storage (Google Cloud Storage backend)
- **Bucket:** replit-objstore-af327fe0-51d5-4214-a216-aef8165ef304
- **Private Directory:** /.private/audio/
- **Access:** Private (served via /api/audio endpoint)

### Database
- **Provider:** Replit PostgreSQL (Neon)
- **ORM:** Drizzle
- **Key Tables:** stories, code_repositories, generation_logs

---

## Issues Resolved During Testing

1. **Storage Public Access Prevention**
   - Issue: `makePublic()` calls failed due to Replit Object Storage restrictions
   - Fix: Removed public access calls, audio served via `/api/audio` API route

2. **Model Selection Bug**
   - Issue: Tutorial narrative style selected GPT-4o Mini but used Anthropic provider
   - Fix: Set explicit model_config on story to force Claude Sonnet 4

3. **Audio URL Conversion**
   - Issue: Player tried to load storage paths directly
   - Fix: Added `getAudioApiUrl()` helper to convert paths to API URLs

---

## Frontend Verification

All 5 story players verified working with:
- Correct duration display
- Part X of Y chunk navigation
- Play/pause controls
- Progress bar
- Volume controls
- Chapter navigation (where applicable)

---

## Next Steps / Recommendations

1. **Use Claude Opus 4.5** - Update model selection to use Opus 4.5 for higher quality scripts
2. **ElevenLabs Studio Mode** - Test full Studio API integration for podcast/documentary formats
3. **Add Telemetry Dashboard** - Display generation metrics and costs
4. **Mobile Responsiveness** - Test and optimize player for mobile devices
5. **Chapter Navigation** - Verify chapter markers align with audio timestamps
