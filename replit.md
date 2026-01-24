# Code Tales Platform

## Overview
Code Tales is a platform that transforms GitHub repositories into engaging audio stories using advanced AI. It analyzes code, generates narrative scripts, and synthesizes them into high-quality audio. The project aims to make complex codebases accessible and understandable through an innovative auditory experience, catering to developers, learners, and tech enthusiasts.

## User Preferences
- Iterative development with frequent review cycles
- Clear, concise explanations for modifications
- Confirmation required before major architectural changes
- Functional programming paradigms where appropriate
- Maintainable, readable code with good documentation
- Detailed explanations for AI model interactions
- Do not modify files in `docs/` folder without explicit instruction
- Database schema changes require explicit approval

## System Architecture

### Technology Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16 (App Router) |
| UI Library | React | 19 |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS | 4 |
| UI Components | shadcn/ui | Radix primitives |
| Database ORM | Drizzle ORM | Type-safe |
| Database | PostgreSQL | Replit Neon-backed |
| Authentication | Replit Auth | OpenID Connect |
| AI Provider | Anthropic Claude | claude-sonnet-4-20250514 |
| Audio Synthesis | ElevenLabs | TTS, GenFM, Audiobook |
| Object Storage | Replit Object Storage | Private audio |

### Generation Modes
The platform supports two primary generation pipelines:

1. **Hybrid Mode** (Claude + TTS)
   - Claude generates narrative scripts from repo analysis
   - ElevenLabs TTS synthesizes audio in chunks
   - Full control over script content and style

2. **Studio Mode** (ElevenLabs GenFM/Audiobook)
   - ElevenLabs generates both script and audio
   - Multi-voice narration capabilities
   - Podcast-style conversations

3. **Comparison Mode**
   - Side-by-side generation with both modes
   - Real-time metrics comparison
   - User evaluation of approaches

### Key Components

#### Frontend Pages
- `/` - Landing page with GitHub URL input
- `/discover` - Browse public community stories
- `/dashboard` - User dashboard with stories, drafts, analytics
- `/dashboard/new` - Story creation wizard
- `/story/[id]` - Story playback page
- `/auth/login` - Replit Auth login

#### API Endpoints
| Category | Endpoints |
|----------|-----------|
| Auth | `/api/auth/login`, `callback`, `logout`, `user` |
| Stories | `/api/stories/generate`, `generate-studio`, `generate-compare`, `[id]/status`, `[id]/stream`, `[id]/stages` |
| Drafts | `/api/drafts`, `/api/drafts/[id]` |
| Repositories | `/api/repositories`, `/api/repositories/tree` |
| Voices | `/api/voices`, `/api/voices/preview` |
| Models | `/api/models` |
| Webhooks | `/api/webhooks/elevenlabs` |
| Other | `/api/analytics`, `/api/audio` |

#### Database Schema
| Table | Purpose |
|-------|---------|
| users | User accounts from Replit Auth |
| stories | Generated audio stories |
| story_intents | User intent chat history |
| story_drafts | Saved draft configurations |
| code_repositories | Cached repo analysis |
| processing_logs | Pipeline log entries |
| stage_metrics | Pipeline stage telemetry |
| studio_projects | ElevenLabs project tracking |
| auth_sessions | Session management |

### Pipeline Visibility
Real-time pipeline dashboard shows:
- Stage timeline (running/completed/failed)
- Live log streaming via SSE
- Token usage and cost estimates
- Prompt previews and response samples

### Repository Analysis Pipeline
1. Fetch file tree via GitHub API
2. Extract config files (package.json, go.mod, etc.)
3. Detect languages and statistics
4. Fetch README content
5. Summarize structure for AI context

### Prompt Architecture
- Base: `STORY_ARCHITECT_PROMPT`
- Style variants: fiction, documentary, tutorial, podcast, technical
- Expertise levels: beginner, intermediate, expert
- Duration: 150 words/minute target
- Generated via `ContentGenerationFramework`

## External Dependencies
- **Replit PostgreSQL**: Database managed via Drizzle ORM
- **Replit Auth**: OpenID Connect authentication
- **Anthropic Claude**: Script generation (AI SDK)
- **ElevenLabs TTS**: Audio synthesis (TTS + Studio APIs)
- **Replit Object Storage**: Private audio file storage
- **GitHub API**: Repository metadata and file trees

## Documentation
Comprehensive documentation in `docs/`:
- `SYSTEM_ARCHITECTURE.md` - Full architecture with Mermaid diagrams
- `USER_FLOW.md` - Complete user journey documentation
- `REPOSITORY_ANALYSIS_PIPELINE.md` - Context preparation for AI
- `ELEVENLABS_STUDIO_INTEGRATION_PLAN.md` - Studio API integration

## Environment Variables
| Variable | Purpose |
|----------|---------|
| DATABASE_URL | PostgreSQL connection |
| ANTHROPIC_API_KEY | Claude API access |
| ELEVENLABS_API_KEY | TTS and Studio API |
| DEFAULT_OBJECT_STORAGE_BUCKET_ID | Audio storage |
| REPLIT_DEV_DOMAIN | Webhook URL construction |

## Recent Changes
- **2026-01-12**: Enhanced landing page with story discovery features - filter bar (fiction/documentary/tutorial/technical/comedy), search by title/repo, story count indicators
- **2026-01-12**: Generated 8 new sample stories from popular repos (FastAPI, Flask, LangChain, Supabase, shadcn/ui, Prisma, tRPC, Drizzle ORM)
- **2026-01-12**: Database now contains 28 completed public stories with audio across 6 narrative styles
- **2026-01-12**: Added enhanced TypeScript types matching Python reference (OutputFormat, ContentLength, Tone, AudienceLevel, VoiceConfig, PodcastConfig, etc.)
- **2026-01-12**: Created lib/generation/pipeline-config.ts with master PipelineConfig type
- **2026-01-12**: Added 4 new narrative style prompts (debate, interview, executive, storytelling)
- **2026-01-12**: Created scripts/generate-samples.ts for batch story generation
- **2026-01-12**: Generated sample batch of Hybrid mode stories (Lending Ark Armada, Terraform Credit System, Celestial Hedge AI) with working audio playback
- **2026-01-12**: Updated ElevenLabs Studio API integration to match new API format (podcasts endpoint uses conversation/bulletin modes with nested voice config)
- **2026-01-12**: Documented Studio API limitation - GenFM/Audiobook endpoints require enterprise account whitelisting
- **2026-01-12**: Created COMPREHENSIVE_TEST_PLAN.md with 88 functional tests across 11 categories covering all user flows, API endpoints, and generation modes
- **2026-01-12**: Comprehensive documentation update - SYSTEM_ARCHITECTURE.md (1228 lines, 10 Mermaid diagrams), USER_FLOW.md (1246 lines, 26 Mermaid diagrams), REPOSITORY_ANALYSIS_PIPELINE.md (957 lines, 4 Mermaid diagrams)
- **2026-01-12**: Full visual testing completed - Homepage, Discover, Login, Docs, Story Players all verified
- **2026-01-12**: API endpoint testing verified - /api/voices, /api/models working correctly
- **2026-01-11**: Fixed ElevenLabs Studio integration (callback URL, stage logging, audio download)
- **2026-01-11**: Added stage_metrics and studio_projects database tables
- **2026-01-11**: Implemented pipeline visibility components (dashboard, timeline, live log, metrics)
- **2026-01-11**: Created generation mode selector and comparison view components
