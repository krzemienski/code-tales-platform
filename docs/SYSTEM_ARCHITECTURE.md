# Code Tales: System Architecture

**Version:** 3.1  
**Last Updated:** January 12, 2026

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagrams](#architecture-diagrams)
4. [Component Architecture](#component-architecture)
5. [Generation Modes](#generation-modes)
6. [Pipeline Visibility System](#pipeline-visibility-system)
7. [API Endpoints Catalog](#api-endpoints-catalog)
8. [Database Schema](#database-schema)
9. [Integration Points](#integration-points)

---

## System Overview

Code Tales is an innovative platform that transforms GitHub repositories into immersive audio stories using advanced AI. The platform bridges the gap between complex codebases and auditory learning by:

- **Analyzing Code Repositories**: Fetching and parsing GitHub repositories to understand project structure, dependencies, and architecture patterns
- **Generating Narrative Scripts**: Using Anthropic Claude to create engaging, educational narratives in various styles (fiction, documentary, tutorial, podcast, technical)
- **Synthesizing Audio**: Converting scripts to high-quality audio using ElevenLabs TTS with support for multiple voices and quality presets
- **Providing Interactive Experiences**: Offering a modern web interface with chapter navigation, progress tracking, and comparison between generation modes

The platform supports two primary generation pipelines:
- **Hybrid Mode**: Full control with Claude script generation + ElevenLabs TTS
- **Studio Mode**: ElevenLabs GenFM podcasts or Audiobook projects for multi-voice narration

---

## Technology Stack

| Layer | Technology | Version/Details |
|-------|------------|-----------------|
| **Framework** | Next.js | 16 (App Router) |
| **UI Library** | React | 19 |
| **Language** | TypeScript | Strict mode enabled |
| **Styling** | Tailwind CSS | 4 |
| **UI Components** | shadcn/ui | Radix primitives |
| **Database ORM** | Drizzle ORM | Type-safe queries |
| **Database** | PostgreSQL | Replit Neon-backed |
| **Authentication** | Replit Auth | OpenID Connect |
| **AI Provider** | Anthropic Claude | claude-sonnet-4-20250514, claude-3-5-haiku |
| **Audio Synthesis** | ElevenLabs | TTS, GenFM, Audiobook APIs |
| **Object Storage** | Replit Object Storage | Private audio file storage |
| **Package Manager** | npm/pnpm | Node.js 20+ |

### Key Dependencies

```
@ai-sdk/anthropic     - Anthropic AI SDK for script generation
@ai-sdk/react         - React hooks for AI streaming
drizzle-orm           - Type-safe database ORM
framer-motion         - Animations and transitions
lucide-react          - Icon library
react-markdown        - Markdown rendering
sonner                - Toast notifications
```

---

## Architecture Diagrams

### System Component Diagram

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Browser"]
        ReactApp["React 19 App"]
    end

    subgraph NextJS["Next.js 16 Application"]
        AppRouter["App Router"]
        
        subgraph Pages["Pages"]
            Landing["Landing Page"]
            Dashboard["Dashboard"]
            StoryView["Story Player"]
            Discover["Discover"]
            Auth["Auth Pages"]
        end
        
        subgraph API["API Routes"]
            AuthAPI["/api/auth/*"]
            StoriesAPI["/api/stories/*"]
            DraftsAPI["/api/drafts/*"]
            ReposAPI["/api/repositories/*"]
            VoicesAPI["/api/voices/*"]
            ModelsAPI["/api/models/*"]
            WebhooksAPI["/api/webhooks/*"]
            AnalyticsAPI["/api/analytics"]
            AudioAPI["/api/audio"]
        end
    end

    subgraph ExternalServices["External Services"]
        GitHub["GitHub API"]
        Claude["Anthropic Claude"]
        ElevenLabs["ElevenLabs API"]
        ReplitAuth["Replit Auth (OIDC)"]
    end

    subgraph DataLayer["Data Layer"]
        PostgreSQL["PostgreSQL Database"]
        ObjectStorage["Replit Object Storage"]
    end

    Browser --> ReactApp
    ReactApp --> AppRouter
    AppRouter --> Pages
    AppRouter --> API

    AuthAPI --> ReplitAuth
    StoriesAPI --> Claude
    StoriesAPI --> ElevenLabs
    ReposAPI --> GitHub
    VoicesAPI --> ElevenLabs
    WebhooksAPI --> ElevenLabs

    API --> PostgreSQL
    StoriesAPI --> ObjectStorage
    AudioAPI --> ObjectStorage
```

### Hybrid Mode Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API as /api/stories/generate
    participant GitHub
    participant Claude as Anthropic Claude
    participant ElevenLabs as ElevenLabs TTS
    participant Storage as Object Storage
    participant DB as PostgreSQL

    User->>Frontend: Create Story Request
    Frontend->>API: POST /api/stories/generate
    API->>DB: Create story record (status: processing)
    
    rect rgb(240, 240, 255)
        Note over API,GitHub: Phase 1: Repository Analysis (5-30%)
        API->>GitHub: Fetch repo tree & metadata
        GitHub-->>API: Repository structure, README, package.json
        API->>DB: Cache analysis in code_repositories
    end

    rect rgb(240, 255, 240)
        Note over API,Claude: Phase 2: Script Generation (30-70%)
        API->>Claude: Generate narrative script
        Note right of Claude: Model: claude-sonnet-4<br/>Style: fiction/documentary/etc<br/>Target duration: N minutes
        Claude-->>API: Complete script text
        API->>DB: Store script_text, parse chapters
    end

    rect rgb(255, 240, 240)
        Note over API,ElevenLabs: Phase 3: Audio Synthesis (70-95%)
        loop For each text chunk
            API->>ElevenLabs: POST /v1/text-to-speech/{voice_id}
            ElevenLabs-->>API: MP3 audio buffer
            API->>Storage: Upload chunk to .private/audio/
        end
    end

    API->>DB: Update story (status: completed)
    API-->>Frontend: Generation complete
    Frontend->>User: Display story with player
```

### Studio Mode Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API as /api/stories/generate-studio
    participant GitHub
    participant ElevenLabs as ElevenLabs Studio
    participant Webhook as /api/webhooks/elevenlabs
    participant Storage as Object Storage
    participant DB as PostgreSQL

    User->>Frontend: Create Studio Story
    Frontend->>API: POST /api/stories/generate-studio
    API->>DB: Create story (mode: studio_podcast/audiobook)

    rect rgb(240, 240, 255)
        Note over API,GitHub: Phase 1: Content Preparation
        API->>GitHub: Fetch repository analysis
        GitHub-->>API: Repository content
    end

    rect rgb(255, 245, 230)
        Note over API,ElevenLabs: Phase 2: Studio Project Creation
        alt Podcast Format
            API->>ElevenLabs: POST /v1/studio/create-podcast
            Note right of ElevenLabs: GenFM with host/guest voices
        else Audiobook Format
            API->>ElevenLabs: POST /v1/studio/projects
            Note right of ElevenLabs: Audiobook with narrator voice
        end
        ElevenLabs-->>API: project_id, initial status
        API->>DB: Store studio_project record
    end

    rect rgb(230, 255, 230)
        Note over ElevenLabs,Webhook: Phase 3: Async Processing
        ElevenLabs->>Webhook: POST webhook (conversion progress)
        Webhook->>DB: Update conversion_progress
        ElevenLabs->>Webhook: POST webhook (completion)
        Webhook->>DB: Mark project complete
    end

    rect rgb(255, 230, 230)
        Note over API,Storage: Phase 4: Audio Download
        API->>ElevenLabs: GET project audio
        ElevenLabs-->>API: Complete audio file
        API->>Storage: Upload to .private/audio/
        API->>DB: Update story with audio URL
    end

    API-->>Frontend: Story ready
    Frontend->>User: Play Studio-generated audio
```

### Database Schema Relationships

```mermaid
erDiagram
    users ||--o{ stories : creates
    users ||--o{ code_repositories : owns
    users ||--o{ story_intents : creates
    users ||--o{ story_drafts : saves
    users ||--o{ auth_sessions : has
    
    code_repositories ||--o{ stories : source_for
    code_repositories ||--o{ story_intents : analyzes
    
    story_intents ||--o| stories : generates
    
    stories ||--o{ story_chapters : contains
    stories ||--o{ processing_logs : logs
    stories ||--o{ stage_metrics : tracks
    stories ||--o| studio_projects : uses

    users {
        varchar id PK
        varchar email UK
        varchar first_name
        varchar last_name
        varchar profile_image_url
        varchar subscription_tier
        jsonb preferences
        jsonb usage_quota
        integer stories_used_this_month
        integer minutes_used_this_month
        timestamp created_at
        timestamp updated_at
    }

    stories {
        uuid id PK
        varchar user_id FK
        uuid intent_id FK
        uuid repository_id FK
        text title
        text narrative_style
        text voice_id
        integer target_duration_minutes
        integer actual_duration_seconds
        text expertise_level
        text script_text
        text audio_url
        jsonb audio_chunks
        jsonb chapters
        text status
        integer progress
        text progress_message
        timestamp processing_started_at
        timestamp processing_completed_at
        text error_message
        boolean is_public
        text share_id UK
        integer play_count
        timestamp last_played_at
        integer last_played_position
        text generation_mode
        jsonb model_config
        timestamp created_at
        timestamp updated_at
    }

    code_repositories {
        uuid id PK
        varchar user_id FK
        text repo_url
        text repo_name
        text repo_owner
        text primary_language
        integer stars_count
        text description
        jsonb analysis_cache
        timestamp analysis_cached_at
        timestamp created_at
    }

    story_intents {
        uuid id PK
        varchar user_id FK
        uuid repository_id FK
        text intent_category
        text user_description
        jsonb focus_areas
        text expertise_level
        jsonb conversation_history
        jsonb generated_plan
        timestamp created_at
    }

    story_drafts {
        uuid id PK
        varchar user_id FK
        text repository_url
        text repository_name
        text repository_owner
        text repository_description
        text repository_language
        integer repository_stars
        jsonb style_config
        jsonb model_config
        jsonb voice_config
        timestamp scheduled_at
        timestamp created_at
        timestamp updated_at
    }

    story_chapters {
        uuid id PK
        uuid story_id FK
        integer chapter_number
        text title
        integer start_time_seconds
        integer duration_seconds
        text script_segment
        text audio_url
        jsonb focus_files
        jsonb key_concepts
        timestamp created_at
    }

    processing_logs {
        uuid id PK
        uuid story_id FK
        timestamp timestamp
        text agent_name
        text action
        jsonb details
        text level
    }

    stage_metrics {
        uuid id PK
        uuid story_id FK
        text stage_name
        integer stage_order
        timestamp started_at
        timestamp ended_at
        integer duration_ms
        text status
        integer input_tokens
        integer output_tokens
        text cost_estimate
        text prompt_used
        text response_preview
        jsonb metadata
        timestamp created_at
    }

    studio_projects {
        uuid id PK
        uuid story_id FK
        text elevenlabs_project_id
        text project_type
        text status
        integer conversion_progress
        boolean webhook_received
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    auth_sessions {
        varchar id PK
        varchar user_id FK
        timestamp expires_at
        timestamp created_at
    }

    sessions {
        varchar sid PK
        jsonb sess
        timestamp expire
    }
```

---

## Component Architecture

### Frontend Components Hierarchy

```mermaid
graph TB
    subgraph App["App Layout"]
        RootLayout["RootLayout"]
        ThemeProvider["ThemeProvider"]
        AudioPlayerProvider["AudioPlayerContext"]
    end

    subgraph GlobalComponents["Global Components"]
        Navbar["Navbar"]
        Footer["Footer"]
        FloatingPlayer["FloatingPlayer"]
        AuthModal["AuthModal"]
    end

    subgraph Pages["Page Components"]
        subgraph Landing["Landing (/)"]
            HeroSection["HeroSection"]
            TalesCarousel["TalesCarousel"]
            FeaturedHero["FeaturedHero"]
            ParallaxBackground["ParallaxBackground"]
        end

        subgraph DashboardPages["Dashboard"]
            DashboardLayout["DashboardLayout"]
            DashboardNav["DashboardNav"]
            DashboardHome["Dashboard Home"]
            NewStory["New Story Page"]
            StoryDetail["Story Detail"]
            Analytics["Analytics Page"]
            Settings["Settings Page"]
        end

        subgraph DiscoverPage["Discover"]
            PublicStoryCard["PublicStoryCard"]
            TrendingStories["TrendingStories"]
        end

        subgraph StoryPage["Story Player"]
            StoryPlayer["StoryPlayer"]
            AudioPlayer["AudioPlayer"]
            ChronicleCard["ChronicleCard"]
        end
    end

    subgraph StoryCreation["Story Creation Components"]
        StoryGenerator["StoryGenerator"]
        RepoInput["RepoInput"]
        RepoTreePreview["RepoTreePreview"]
        IntentChat["IntentChat"]
        GenerationModeSelector["GenerationModeSelector"]
        GenerationConfig["GenerationConfig"]
        GenerationEstimate["GenerationEstimate"]
        ModelSelector["ModelSelector"]
        VoicePairSelector["VoicePairSelector"]
        VoicePreviewButton["VoicePreviewButton"]
        StudioOptions["StudioOptions"]
    end

    subgraph Pipeline["Pipeline Components"]
        PipelineDashboard["PipelineDashboard"]
        StageTimeline["StageTimeline"]
        MetricsPanel["MetricsPanel"]
        LiveLog["LiveLog"]
        ProcessingLogs["ProcessingLogs"]
        StoryProcessing["StoryProcessing"]
    end

    subgraph UI["UI Components (shadcn/ui)"]
        Button["Button"]
        Card["Card"]
        Dialog["Dialog"]
        Tabs["Tabs"]
        Progress["Progress"]
        Select["Select"]
        Slider["Slider"]
        Switch["Switch"]
        Toast["Toast (Sonner)"]
        Tooltip["Tooltip"]
        Avatar["Avatar"]
        Badge["Badge"]
        DropdownMenu["DropdownMenu"]
        Sheet["Sheet"]
    end

    RootLayout --> ThemeProvider
    ThemeProvider --> AudioPlayerProvider
    AudioPlayerProvider --> GlobalComponents
    AudioPlayerProvider --> Pages

    DashboardPages --> DashboardLayout
    DashboardLayout --> DashboardNav

    NewStory --> StoryCreation
    StoryDetail --> Pipeline

    StoryCreation --> UI
    Pipeline --> UI
    Pages --> UI
```

### Key Component Descriptions

| Component | Purpose |
|-----------|---------|
| **StoryGenerator** | Main orchestrator for story creation flow |
| **IntentChat** | Conversational interface for capturing user intent |
| **GenerationModeSelector** | Toggle between Hybrid and Studio modes |
| **PipelineDashboard** | Real-time visualization of generation stages |
| **StageTimeline** | Visual progress through pipeline phases |
| **StoryPlayer** | Full audio playback with chapters and controls |
| **FloatingPlayer** | Persistent mini-player across pages |
| **ComparisonView** | Side-by-side comparison of generation modes |

---

## Generation Modes

Code Tales supports two primary generation pipelines, each with distinct characteristics and use cases.

### Mode Comparison

| Aspect | Hybrid Mode | Studio Mode |
|--------|-------------|-------------|
| **Script Generation** | Claude AI (claude-sonnet-4) | ElevenLabs (internal) |
| **Audio Synthesis** | ElevenLabs TTS API | ElevenLabs GenFM/Audiobook |
| **Script Control** | Full user control | Auto-generated |
| **Voice Options** | Single narrator | Multi-voice (host/guest) |
| **Processing Model** | Synchronous | Async with webhooks |
| **Best For** | Custom narratives, tutorials | Podcasts, conversations |

### Hybrid Mode (Claude + ElevenLabs TTS)

In Hybrid mode, the platform maintains full control over script generation using Anthropic Claude, then synthesizes audio using ElevenLabs text-to-speech.

**Pipeline Stages:**
1. **Repository Analysis** (0-20%) - Fetch and parse GitHub repository structure
2. **Script Generation** (20-70%) - Claude generates narrative based on analysis
3. **Chapter Parsing** (70-75%) - Extract chapters and structure from script
4. **Audio Synthesis** (75-95%) - ElevenLabs TTS converts text chunks to audio
5. **Finalization** (95-100%) - Merge chunks, update database, notify user

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Frontend
    participant API as /api/stories/generate
    participant GitHub
    participant Claude as Anthropic Claude
    participant ElevenLabs as ElevenLabs TTS
    participant Storage as Object Storage
    participant DB as PostgreSQL

    User->>Frontend: Create Story Request
    Frontend->>API: POST /api/stories/generate
    API->>DB: Create story record (status: processing)
    
    rect rgb(240, 240, 255)
        Note over API,GitHub: Stage 1: Repository Analysis
        API->>GitHub: Fetch repo tree & metadata
        GitHub-->>API: Repository structure, README, package.json
        API->>DB: Cache analysis in code_repositories
        API->>DB: Log stage metrics (input tokens, duration)
    end

    rect rgb(240, 255, 240)
        Note over API,Claude: Stage 2: Script Generation
        API->>Claude: Generate narrative script
        Note right of Claude: Model: claude-sonnet-4<br/>Temperature: 0.7<br/>Max tokens: ~6000
        Claude-->>API: Complete script text
        API->>DB: Store script_text, record token usage
    end

    rect rgb(255, 250, 240)
        Note over API,Claude: Stage 3: Chapter Parsing
        API->>Claude: Parse script into chapters (Haiku)
        Claude-->>API: Chapter metadata array
        API->>DB: Store parsed chapters
    end

    rect rgb(255, 240, 240)
        Note over API,ElevenLabs: Stage 4: Audio Synthesis
        loop For each text chunk (~4000 chars)
            API->>ElevenLabs: POST /v1/text-to-speech/{voice_id}
            ElevenLabs-->>API: MP3 audio buffer
            API->>Storage: Upload chunk to .private/audio/{storyId}/
            API->>DB: Update progress percentage
        end
    end

    API->>DB: Update story (status: completed, audioUrl)
    API-->>Frontend: Generation complete
    Frontend->>User: Display story with player
```

### Studio Mode (ElevenLabs GenFM/Audiobook)

In Studio mode, ElevenLabs handles both script generation and audio synthesis using their GenFM (podcast) or Audiobook APIs. This enables multi-voice conversations and professional-grade productions.

**Formats:**
- **GenFM Podcast**: Conversational format with host/guest voices
- **Audiobook**: Professional narrator with chapter structure

**Pipeline Stages:**
1. **Repository Analysis** (0-15%) - Prepare content from GitHub repo
2. **Studio Project Creation** (15-25%) - Submit to ElevenLabs Studio API
3. **Async Processing** (25-90%) - ElevenLabs generates script and audio
4. **Webhook Callbacks** - Receive progress updates via webhook
5. **Audio Download** (90-100%) - Fetch and store completed audio

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Frontend
    participant API as /api/stories/generate-studio
    participant GitHub
    participant ElevenLabs as ElevenLabs Studio
    participant Webhook as /api/webhooks/elevenlabs
    participant Storage as Object Storage
    participant DB as PostgreSQL

    User->>Frontend: Create Studio Story
    Frontend->>API: POST /api/stories/generate-studio
    API->>DB: Create story (mode: studio_podcast/audiobook)

    rect rgb(240, 240, 255)
        Note over API,GitHub: Stage 1: Content Preparation
        API->>GitHub: Fetch repository analysis
        GitHub-->>API: Repository content & README
        API->>DB: Store repository analysis
    end

    rect rgb(255, 245, 230)
        Note over API,ElevenLabs: Stage 2: Studio Project Creation
        alt Podcast Format (GenFM)
            API->>ElevenLabs: POST /v1/studio/create-podcast
            Note right of ElevenLabs: GenFM with host/guest<br/>voices, duration scale,<br/>quality preset
        else Audiobook Format
            API->>ElevenLabs: POST /v1/studio/projects
            Note right of ElevenLabs: Audiobook with narrator<br/>voice, chapter structure
        end
        ElevenLabs-->>API: project_id, initial status
        API->>DB: Create studio_projects record
    end

    rect rgb(230, 255, 230)
        Note over ElevenLabs,Webhook: Stage 3: Async Processing
        loop Until completion
            ElevenLabs->>Webhook: POST webhook (conversion_progress)
            Webhook->>DB: Update conversion_progress in studio_projects
            Webhook->>DB: Update story progress percentage
        end
        ElevenLabs->>Webhook: POST webhook (project_conversion_status: success)
        Webhook->>DB: Mark project complete, webhook_received = true
    end

    rect rgb(255, 230, 230)
        Note over API,Storage: Stage 4: Audio Download
        API->>ElevenLabs: GET /v1/studio/projects/{id}/audio
        ElevenLabs-->>API: Complete audio file (MP3)
        API->>Storage: Upload to .private/audio/{storyId}/
        API->>DB: Update story with audioUrl, status: completed
    end

    API-->>Frontend: Story ready
    Frontend->>User: Play Studio-generated audio
```

### Comparison Mode

Comparison mode runs both Hybrid and Studio pipelines in parallel, allowing users to evaluate and compare the results side-by-side.

```mermaid
flowchart TB
    subgraph Input["User Input"]
        RepoURL["Repository URL"]
        Config["Generation Config"]
    end

    subgraph Parallel["Parallel Generation"]
        direction LR
        subgraph HybridPipeline["Hybrid Pipeline"]
            H1["Analyze Repo"]
            H2["Claude Script"]
            H3["TTS Audio"]
            H1 --> H2 --> H3
        end
        
        subgraph StudioPipeline["Studio Pipeline"]
            S1["Analyze Repo"]
            S2["Submit to GenFM"]
            S3["Await Completion"]
            S1 --> S2 --> S3
        end
    end

    subgraph Results["Comparison View"]
        HybridResult["Hybrid Result<br/>Script + Audio"]
        StudioResult["Studio Result<br/>Podcast Audio"]
        Metrics["Token Usage | Cost | Duration"]
    end

    RepoURL --> Parallel
    Config --> Parallel
    HybridPipeline --> HybridResult
    StudioPipeline --> StudioResult
    HybridResult --> Metrics
    StudioResult --> Metrics
```

---

## Pipeline Visibility System

The Pipeline Visibility System provides real-time progress tracking for story generation, enabling users to monitor each stage of the pipeline as it executes.

### Architecture Overview

```mermaid
flowchart TB
    subgraph Generation["Generation Pipeline"]
        Stage1["Stage 1: Repository Analysis"]
        Stage2["Stage 2: Script Generation"]
        Stage3["Stage 3: Chapter Parsing"]
        Stage4["Stage 4: Audio Synthesis"]
        Stage5["Stage 5: Finalization"]
        Stage1 --> Stage2 --> Stage3 --> Stage4 --> Stage5
    end

    subgraph Logging["Logging Layer"]
        StageMetrics["stage_metrics table"]
        ProcessingLogs["processing_logs table"]
        StoryStatus["stories.status/progress"]
    end

    subgraph API["Real-time API"]
        SSEStream["/api/stories/[id]/stream<br/>Server-Sent Events"]
        StagesEndpoint["/api/stories/[id]/stages"]
        LogsEndpoint["/api/stories/[id]/logs"]
    end

    subgraph Frontend["Frontend Components"]
        PipelineDashboard["PipelineDashboard"]
        StageTimeline["StageTimeline"]
        MetricsPanel["MetricsPanel"]
        LiveLog["LiveLog"]
    end

    Generation -->|"Record metrics"| StageMetrics
    Generation -->|"Write logs"| ProcessingLogs
    Generation -->|"Update status"| StoryStatus

    StageMetrics --> SSEStream
    ProcessingLogs --> SSEStream
    StoryStatus --> SSEStream
    StageMetrics --> StagesEndpoint
    ProcessingLogs --> LogsEndpoint

    SSEStream -->|"EventSource"| PipelineDashboard
    PipelineDashboard --> StageTimeline
    PipelineDashboard --> MetricsPanel
    PipelineDashboard --> LiveLog
```

### Server-Sent Events (SSE) Stream

The real-time updates are delivered via SSE from `/api/stories/[id]/stream`. The stream polls the database every 2 seconds and emits the following event types:

| Event | Data | Description |
|-------|------|-------------|
| `status` | `{storyId, status, progress, progressMessage, generationMode, processingStartedAt, errorMessage}` | Current story status and progress |
| `stages` | `[{stageName, stageOrder, status, durationMs, inputTokens, outputTokens, costEstimate, promptUsed, responsePreview}]` | All pipeline stage metrics |
| `logs` | `[{timestamp, agentName, action, level, details}]` | Recent processing log entries (last 20) |
| `complete` | `{status, audioUrl, audioChunks, actualDurationSeconds}` | Final completion notification |
| `error` | `{message}` | Error information |

### SSE Connection Sequence

```mermaid
sequenceDiagram
    participant Client as PipelineDashboard
    participant SSE as /api/stories/[id]/stream
    participant DB as PostgreSQL

    Client->>SSE: Open EventSource connection
    SSE->>SSE: Initialize polling loop

    loop Every 2 seconds
        SSE->>DB: Query stories, stage_metrics, processing_logs
        DB-->>SSE: Current state
        SSE-->>Client: event: status
        SSE-->>Client: event: stages
        SSE-->>Client: event: logs
    end

    alt Story completes
        SSE-->>Client: event: complete
        SSE->>SSE: Close stream
        Client->>Client: Update UI, enable playback
    else Story fails
        SSE-->>Client: event: complete (status: failed)
        SSE->>SSE: Close stream
        Client->>Client: Display error message
    end
```

### Stage Metrics Tracking

Each pipeline stage records detailed metrics for observability:

```typescript
interface StageMetric {
  stageName: string       // "repo_analysis", "script_generation", etc.
  stageOrder: number      // Execution order (1, 2, 3...)
  status: "pending" | "running" | "completed" | "failed"
  startedAt: timestamp    // When stage began
  endedAt: timestamp      // When stage finished
  durationMs: number      // Total execution time
  inputTokens: number     // AI input tokens (for Claude stages)
  outputTokens: number    // AI output tokens
  costEstimate: string    // Estimated cost ("$0.0234")
  promptUsed: string      // First 500 chars of prompt
  responsePreview: string // First 500 chars of response
  metadata: object        // Stage-specific data
}
```

### Frontend Components

#### PipelineDashboard
The main orchestrator component that manages SSE connection and distributes data to child components.

```typescript
// Key functionality
- Establishes EventSource connection to /api/stories/[id]/stream
- Parses incoming SSE events and updates state
- Calculates aggregate metrics (total tokens, cost, duration)
- Manages connection lifecycle (reconnection on error)
```

#### StageTimeline
Visual timeline showing each pipeline stage with status indicators.

| Visual State | Meaning |
|--------------|---------|
| ⏳ Gray circle | Pending - not yet started |
| 🔄 Spinning blue | Running - currently executing |
| ✅ Green check | Completed successfully |
| ❌ Red X | Failed with error |

#### MetricsPanel
Displays aggregate statistics:
- Total input/output tokens
- Estimated cost breakdown
- Total processing duration
- Tokens per second throughput

#### LiveLog
Real-time scrolling log viewer:
- Color-coded by level (info, warning, error, success)
- Shows agent name, action, timestamp
- Expandable details for each entry
- Auto-scrolls to newest entries

### Log Levels

| Level | Color | Usage |
|-------|-------|-------|
| `info` | Blue | Normal progress updates |
| `success` | Green | Stage completions, milestones |
| `warning` | Yellow | Non-fatal issues, retries |
| `error` | Red | Failures, exceptions |

### Agent Names

| Agent | Responsibility |
|-------|----------------|
| `System` | Pipeline orchestration, lifecycle events |
| `RepoAnalyzer` | GitHub API interactions, file parsing |
| `Narrator` | Claude script generation |
| `ChapterParser` | Script structure extraction |
| `Synthesizer` | ElevenLabs TTS processing |
| `StudioGenerator` | ElevenLabs Studio API interactions |

---

## API Endpoints Catalog

### Authentication (`/api/auth/*`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | GET | Initiates Replit OAuth flow, redirects to authorization |
| `/api/auth/callback` | GET | Handles OAuth callback, creates session, stores user |
| `/api/auth/logout` | POST | Clears session cookies, ends user session |
| `/api/auth/user` | GET | Returns current authenticated user data |

### Stories (`/api/stories/*`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stories` | GET | List user's stories with pagination |
| `/api/stories` | POST | Create new story record |
| `/api/stories/[id]` | GET | Get single story details |
| `/api/stories/[id]` | DELETE | Delete a story |
| `/api/stories/generate` | POST | Trigger Hybrid mode generation pipeline |
| `/api/stories/generate-studio` | POST | Trigger Studio mode (GenFM/Audiobook) generation |
| `/api/stories/generate-compare` | POST | Generate story with both modes for comparison |
| `/api/stories/[id]/status` | GET | Get real-time generation progress |
| `/api/stories/[id]/stream` | GET | SSE stream of generation updates |
| `/api/stories/[id]/stages` | GET | Get detailed stage metrics |
| `/api/stories/[id]/logs` | GET | Get processing logs for debugging |
| `/api/stories/[id]/restart` | POST | Restart failed generation |
| `/api/stories/[id]/download` | GET | Download completed audio file |
| `/api/stories/[id]/play-count` | POST | Increment play count |
| `/api/stories/public` | GET | List public stories for discovery |
| `/api/stories/regenerate-audio` | POST | Regenerate audio for existing script |
| `/api/stories/regenerate-batch` | POST | Batch regenerate multiple stories |

### Drafts (`/api/drafts/*`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/drafts` | GET | List user's saved drafts |
| `/api/drafts` | POST | Save story draft |
| `/api/drafts/[id]` | GET | Get specific draft |
| `/api/drafts/[id]` | PUT | Update draft |
| `/api/drafts/[id]` | DELETE | Delete draft |

### Repositories (`/api/repositories/*`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/repositories` | GET | List analyzed repositories |
| `/api/repositories` | POST | Add and analyze new repository |
| `/api/repositories/tree` | GET | Fetch repository file tree from GitHub |

### Voices & Models

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/voices` | GET | List available ElevenLabs voices |
| `/api/voices/preview` | GET | Get voice preview audio sample |
| `/api/models` | GET | List available Claude AI models |

### Webhooks (`/api/webhooks/*`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/webhooks/elevenlabs` | POST | Handle ElevenLabs Studio project callbacks |

### Other

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analytics` | GET | Get user analytics and usage statistics |
| `/api/audio` | GET | Serve audio files from object storage |
| `/api/chat/intent` | POST | Process intent chat messages with AI |

---

## Database Schema

### Core Tables

#### `users`
Stores user profiles synced from Replit Auth with subscription and usage tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR | Primary key (Replit user ID) |
| `email` | VARCHAR | Unique email address |
| `first_name` | VARCHAR | User's first name |
| `last_name` | VARCHAR | User's last name |
| `profile_image_url` | VARCHAR | Avatar URL |
| `subscription_tier` | VARCHAR | free, pro, enterprise |
| `preferences` | JSONB | User preferences |
| `usage_quota` | JSONB | Monthly limits |
| `stories_used_this_month` | INTEGER | Current usage count |
| `minutes_used_this_month` | INTEGER | Audio minutes used |

#### `stories`
Main entity storing generated audio stories with all metadata.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | VARCHAR | FK to users |
| `repository_id` | UUID | FK to code_repositories |
| `title` | TEXT | Story title |
| `narrative_style` | TEXT | fiction, documentary, tutorial, podcast, technical |
| `voice_id` | TEXT | ElevenLabs voice ID |
| `status` | TEXT | pending, processing, completed, failed |
| `progress` | INTEGER | 0-100 completion percentage |
| `script_text` | TEXT | Generated narrative script |
| `audio_url` | TEXT | Primary audio file URL |
| `audio_chunks` | JSONB | Array of chunk URLs |
| `chapters` | JSONB | Chapter metadata |
| `generation_mode` | TEXT | hybrid, studio_podcast, studio_audiobook |
| `is_public` | BOOLEAN | Visibility flag |
| `share_id` | TEXT | Unique sharing identifier |
| `play_count` | INTEGER | Total plays |

#### `story_intents`
Captures user goals and conversation context for intent-driven generation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | VARCHAR | FK to users |
| `repository_id` | UUID | FK to code_repositories |
| `intent_category` | TEXT | architecture_understanding, onboarding, etc. |
| `user_description` | TEXT | User's own description |
| `focus_areas` | JSONB | Specific topics to cover |
| `expertise_level` | TEXT | beginner, intermediate, expert |
| `conversation_history` | JSONB | Chat messages |
| `generated_plan` | JSONB | AI-generated story plan |

#### `story_drafts`
Saved story configurations before generation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | VARCHAR | FK to users |
| `repository_url` | TEXT | GitHub repository URL |
| `style_config` | JSONB | Style settings |
| `model_config` | JSONB | AI model settings |
| `voice_config` | JSONB | Voice settings |
| `scheduled_at` | TIMESTAMP | Future generation time |

#### `code_repositories`
Analyzed GitHub repositories with cached analysis data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | VARCHAR | FK to users |
| `repo_url` | TEXT | Full repository URL |
| `repo_name` | TEXT | Repository name |
| `repo_owner` | TEXT | GitHub username/org |
| `primary_language` | TEXT | Main programming language |
| `analysis_cache` | JSONB | Cached structure analysis |
| `analysis_cached_at` | TIMESTAMP | Cache timestamp |

#### `processing_logs`
Detailed logs for debugging generation pipeline.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `story_id` | UUID | FK to stories |
| `agent_name` | TEXT | System, Analyzer, Narrator, Synthesizer |
| `action` | TEXT | Action being performed |
| `details` | JSONB | Additional context |
| `level` | TEXT | info, warn, error |

#### `stage_metrics`
Pipeline stage performance tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `story_id` | UUID | FK to stories |
| `stage_name` | TEXT | Stage identifier |
| `stage_order` | INTEGER | Execution order |
| `status` | TEXT | pending, running, completed, failed |
| `duration_ms` | INTEGER | Execution time |
| `input_tokens` | INTEGER | AI input tokens |
| `output_tokens` | INTEGER | AI output tokens |
| `cost_estimate` | TEXT | Estimated cost |

#### `studio_projects`
ElevenLabs Studio project tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `story_id` | UUID | FK to stories |
| `elevenlabs_project_id` | TEXT | ElevenLabs project ID |
| `project_type` | TEXT | podcast, audiobook |
| `status` | TEXT | pending, converting, completed |
| `conversion_progress` | INTEGER | 0-100 percentage |
| `webhook_received` | BOOLEAN | Completion callback received |

---

## Integration Points

### Replit Auth (OpenID Connect)

**Purpose**: User authentication and identity management

**Flow**:
1. User clicks "Login with Replit"
2. Redirect to Replit authorization endpoint
3. User grants permissions
4. Callback with authorization code
5. Exchange code for tokens
6. Create/update user record
7. Issue signed session cookie

**Key Files**:
- `server/replit_integrations/auth/replitAuth.ts`
- `lib/auth/index.ts`
- `app/api/auth/*/route.ts`

### GitHub API

**Purpose**: Repository analysis and file content fetching

**Endpoints Used**:
- `GET /repos/{owner}/{repo}` - Repository metadata
- `GET /repos/{owner}/{repo}/git/trees/HEAD?recursive=1` - File tree
- `GET /repos/{owner}/{repo}/contents/{path}` - File content

**Key Files**:
- `lib/agents/github.ts`

### Anthropic AI SDK

**Purpose**: Script generation using Claude models

**Models**:
- `claude-sonnet-4-20250514` - Primary generation (quality)
- `claude-3-5-haiku-20241022` - Chapter parsing, quick tasks (speed)

**Configuration**:
- Temperature: 0.6-0.8 based on narrative style
- Max tokens: 3000-8000 based on target duration

**Key Files**:
- `lib/ai/provider.ts`
- `lib/ai/models.ts`
- `lib/agents/prompts.ts`
- `app/api/stories/generate/route.ts`

### ElevenLabs API

**Purpose**: Text-to-speech synthesis and Studio productions

**Endpoints Used**:
- `POST /v1/text-to-speech/{voice_id}` - Standard TTS
- `POST /v1/studio/create-podcast` - GenFM podcast creation
- `POST /v1/studio/projects` - Audiobook project creation
- `GET /v1/studio/projects/{project_id}` - Project status
- `GET /v1/studio/projects/{project_id}/audio` - Download audio
- `GET /v1/voices` - List available voices

**Quality Presets**: standard, high, ultra, ultra_lossless

**Key Files**:
- `lib/generation/elevenlabs-studio.ts`
- `app/api/stories/generate-studio/route.ts`
- `app/api/voices/route.ts`
- `app/api/webhooks/elevenlabs/route.ts`

### Replit Object Storage

**Purpose**: Private storage for generated audio files

**Structure**:
```
.private/
└── audio/
    └── {storyId}/
        ├── chunk_000.mp3
        ├── chunk_001.mp3
        └── ...
```

**Key Files**:
- `server/replit_integrations/object_storage/objectStorage.ts`
- `lib/storage/index.ts`

**Access Pattern**:
- Files stored privately, served via `/api/audio` endpoint
- Signed URLs for secure access

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (auto) |
| `REPLIT_DOMAINS` | Replit domain for OAuth | Yes (auto) |
| `ANTHROPIC_API_KEY` | Claude API key | Yes |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | Yes |
| `ELEVENLABS_WEBHOOK_URL` | Studio webhook endpoint | Optional |
| `SESSION_SECRET` | Cookie signing secret | Yes |

---

## Security Considerations

1. **Authentication**: All mutating endpoints require authenticated session
2. **Authorization**: Users can only access their own resources
3. **Secrets**: API keys stored securely, never exposed to client
4. **Object Storage**: Audio files in `.private/` with signed URL access
5. **CORS**: Configured for Replit domains only
6. **Rate Limiting**: Applied at API route level
7. **Input Validation**: Zod schemas for all request bodies

---

*This document is maintained as part of the Code Tales project. For updates, refer to the changelog or contact the development team.*
