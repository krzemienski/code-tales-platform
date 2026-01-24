# Code Tales: End-to-End Pipeline Implementation Plan

## Overview
This document outlines the comprehensive plan for designing, implementing, and testing the complete Code Tales pipeline flow - from repository selection to audio playback.

## Current State Assessment

### Validated Components (Ralph Wiggum Tests - 5 Stories, 55+ Minutes)
- GitHub repository analysis pipeline
- Claude AI script generation (using Anthropic Claude Sonnet 4)
- ElevenLabs TTS synthesis (tested: eleven_flash_v2_5, eleven_multilingual_v2, eleven_turbo_v2_5)
- Replit Object Storage for audio files
- Audio serving via `/api/audio` endpoint
- Story player with chapter navigation
- Play count tracking

### Existing Screens
| Route | Screen | Status |
|-------|--------|--------|
| `/` | Home/Landing | Implemented |
| `/discover` | Public Story Browser | Implemented |
| `/story/[id]` | Public Story Player | Implemented |
| `/dashboard` | User Dashboard | Implemented |
| `/dashboard/new` | Tale Creation Wizard | Implemented |
| `/dashboard/story/[id]` | Private Story View | Implemented |
| `/dashboard/settings` | User Settings | Implemented |
| `/dashboard/api-keys` | API Key Management | Implemented |
| `/auth/login` | Authentication | Implemented (Replit Auth) |

---

## Phase 1: Tale Screen Selection Process

### 1.1 Repository Selection (Currently in `/dashboard/new`)
**Current Implementation:**
- `RepoInput` component for GitHub URL input
- Repository analysis via `analyzeRepository()` function
- Validation of public/private repos

**Enhancements Needed:**
- [x] Add repository preview showing file tree (Sprint 2 - `RepoTreePreview` component)
- [x] Display estimated generation time based on repo size (Sprint 2 - `GenerationEstimate` component)
- [ ] Cache previously analyzed repos for faster re-generation
- [ ] Support for private repos with GitHub token input

### 1.2 Narrative Style Selection
**Current Implementation:**
- `ContentGenerationFramework` with 5 primary styles:
  - Comedy, Documentary, Tutorial, Fiction, Podcast
- Secondary styles and tone intensity options
- `IntentChat` for conversational customization

**Enhancements Needed:**
- [ ] Visual preview of style characteristics
- [ ] Sample audio snippets for each style
- [ ] AI-suggested style based on repository content
- [x] Custom style mixing (combine 2 styles) - Sprint 3: Secondary style selection with blend ratio

### 1.3 Duration & Model Configuration
**Current Implementation:**
- Duration selection (5, 10, 15, 20 minutes)
- Model selection (Claude models)
- TTS voice selection

**Enhancements Needed:**
- [x] Cost estimation display (Sprint 2 - `GenerationEstimate` component)
- [x] Processing time estimation (Sprint 2 - `GenerationEstimate` component)
- [x] Voice preview functionality (Sprint 2 - `VoicePreviewButton` component, `/api/voices/preview`)
- [ ] Advanced settings toggle for power users

### 1.4 Preview & Confirmation
**Current Implementation:**
- Summary card before generation
- Loading state with progress indicators

**Enhancements Needed:**
- [ ] Estimated script outline preview
- [ ] Edit confirmation before generation
- [x] Save as draft functionality (Sprint 3 - `/api/drafts`, `story_drafts` table)
- [x] Scheduling for later generation (Sprint 3 - `scheduledAt` field in drafts)

---

## Phase 2: Screen Development Specifications

### 2.1 Home/Landing Page (`/`)
**Components:**
- Hero section with animated orb
- Featured tales carousel (`TalesCarousel`)
- Tale types explanation cards
- Community tales section
- Call-to-action buttons

**Functionality Checklist:**
- [ ] Carousel auto-rotation
- [ ] Responsive mobile layout
- [ ] Quick play preview on hover
- [ ] Social proof elements (play counts, etc.)

### 2.2 Tale Creation Wizard (`/dashboard/new`)
**Step Flow:**
1. Repository Input → 2. Style Selection → 3. Configuration → 4. Preview → 5. Generate

**Components:**
- `RepoInput` - GitHub URL input
- `StyleSelector` - Primary/secondary style picker
- `ConfigPanel` - Duration, model, voice settings
- `IntentChat` - Conversational refinement
- `GenerationPreview` - Final confirmation

**State Management:**
```typescript
interface WizardState {
  step: 1 | 2 | 3 | 4 | 5
  repositoryUrl: string
  repositoryData: RepositoryAnalysis | null
  styleConfig: StyleConfiguration
  modelConfig: ModelConfiguration
  voiceConfig: VoiceConfiguration
  storyIntent: StoryIntent | null
}
```

### 2.3 Generation Progress View
**States:**
- `queued` → `analyzing` → `generating` → `synthesizing` → `completed` | `failed`

**Components:**
- `StoryProcessing` - Main progress display
- `TelemetryLog` - Real-time pipeline logs
- `PhaseBadge` - Current phase indicator
- `EstimatedTimeRemaining` - ETA display

### 2.4 Story Player (`/story/[id]`)
**Components:**
- `StoryPlayer` - Main audio player
- Chapter navigation
- Waveform visualization
- Playback controls (speed, skip)
- Download button
- Share functionality

**Features:**
- [ ] Keyboard shortcuts (space=play, arrows=seek)
- [ ] Mobile-optimized controls
- [ ] Background playback
- [ ] Resume from last position (localStorage)
- [ ] Chapter auto-advance

### 2.5 User Dashboard (`/dashboard`)
**Sections:**
- My Tales library (grid/list view)
- Continue Listening (in-progress stories)
- Trending Community Tales
- Quick stats (total plays, hours generated)

### 2.6 Discover Page (`/discover`)
**Features:**
- Search functionality
- Tab filters (Trending, Recent, By Language)
- Infinite scroll pagination
- Tale cards with preview

---

## Phase 3: Pipeline Flow Architecture

### 3.1 Complete Pipeline Stages

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CODE TALES PIPELINE FLOW                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [1] REPOSITORY ANALYSIS                                            │
│      ├── Fetch repository metadata (GitHub API)                     │
│      ├── Analyze file structure and languages                       │
│      ├── Extract key files (README, package.json, etc.)             │
│      └── Generate repository summary                                │
│                                                                     │
│  [2] SCRIPT GENERATION                                              │
│      ├── Load selected AI model (Claude Sonnet 4)                   │
│      ├── Construct prompt with style config                         │
│      ├── Generate narrative script                                  │
│      ├── Parse into chapters/sections                               │
│      └── Apply tone and pacing adjustments                          │
│                                                                     │
│  [3] AUDIO SYNTHESIS                                                │
│      ├── Split script into chunks (ElevenLabs limits)               │
│      ├── Call TTS API for each chunk                                │
│      ├── Collect audio buffers                                      │
│      ├── Upload to Object Storage                                   │
│      └── Update chapter metadata with audio paths                   │
│                                                                     │
│  [4] POST-PROCESSING                                                │
│      ├── Calculate total duration                                   │
│      ├── Generate waveform data                                     │
│      ├── Update story status to 'completed'                         │
│      └── Trigger notification (if enabled)                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Database Schema (Current)
```sql
-- Core tables
users, auth_sessions, code_repositories, stories, story_chapters, story_intents
```

### 3.3 API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/stories` | POST | Create new story |
| `/api/stories/generate` | POST | Start generation |
| `/api/stories/[id]` | GET/PATCH | Fetch/update story |
| `/api/stories/[id]/status` | GET | Get generation status |
| `/api/stories/[id]/logs` | GET | Get processing logs |
| `/api/audio` | GET | Serve audio files |

---

## Phase 4: Testing Strategy

### 4.1 Unit Tests
**Target Coverage: 80%+**

| Component | Test Cases |
|-----------|------------|
| `RepoInput` | URL validation, error states, loading states |
| `StyleSelector` | Selection logic, state management |
| `StoryPlayer` | Play/pause, seek, chapter navigation |
| `AudioScrubber` | Click handling, progress display |
| `ChronicleCard` | Render states, click handlers |

**Testing Framework:** Vitest + React Testing Library

### 4.2 Integration Tests
| Flow | Test Cases |
|------|------------|
| Repository Analysis | Valid repo, invalid repo, private repo, rate limits |
| Script Generation | All 5 styles, different durations, error handling |
| Audio Synthesis | TTS success, TTS failure, partial failure |
| Storage | Upload, retrieve, streaming |

### 4.3 End-to-End Tests
**Framework:** Playwright

| Scenario | Steps |
|----------|-------|
| Complete Tale Creation | Login → New → Repo → Style → Generate → Play |
| Story Playback | Load page → Play → Seek → Chapter Nav → Complete |
| Discovery Flow | Home → Discover → Search → Select → Play |
| Dashboard Management | Login → Dashboard → View Tales → Play → Settings |

### 4.4 Performance Tests
- Page load times (< 3s target)
- Audio loading latency (< 500ms)
- Generation throughput
- API response times

### 4.5 Error Handling Tests
| Scenario | Expected Behavior |
|----------|------------------|
| Invalid GitHub URL | Show validation error |
| Private repo without token | Prompt for GitHub token |
| TTS API failure | Retry 3x, then show error |
| Audio file missing | Show placeholder, log error |
| Network timeout | Show retry button |

---

## Phase 5: Iterative Review Process

### 5.1 Review Checkpoints

| Checkpoint | Trigger | Criteria |
|------------|---------|----------|
| CP1: Repo Analysis | After Phase 1.1 | All repo types handled |
| CP2: Style Selection | After Phase 1.2 | UI polished, responsive |
| CP3: Generation Flow | After Phase 2.3 | Progress visible, logs working |
| CP4: Playback | After Phase 2.4 | All controls functional |
| CP5: Full Pipeline | After Phase 3 | E2E flow complete |
| CP6: Testing | After Phase 4 | 80%+ coverage |

### 5.2 Test Outcome Procedures

**On Test Failure:**
1. Log detailed error with stack trace
2. Classify severity (Critical/High/Medium/Low)
3. Create fix task in backlog
4. Critical/High: Fix before proceeding
5. Medium/Low: Document for next iteration

**On Test Success:**
1. Mark checkpoint complete
2. Update progress documentation
3. Proceed to next checkpoint

### 5.3 Deployment Readiness Criteria

| Category | Requirement | Status |
|----------|-------------|--------|
| Functionality | All core flows working | Pending |
| Error Handling | Graceful degradation | Pending |
| Performance | < 3s page loads | Pending |
| Security | No exposed secrets | ✓ |
| Mobile | Responsive on all screens | Pending |
| Accessibility | WCAG 2.1 AA compliance | Pending |
| Documentation | Updated replit.md | ✓ |

---

## Implementation Priority

### Immediate (Sprint 1)
1. Complete E2E testing of current pipeline
2. Fix any critical bugs from testing
3. Implement resume playback functionality
4. Add keyboard shortcuts to player

### Short-term (Sprint 2)
1. Repository preview in wizard
2. Voice preview functionality
3. Cost/time estimation display
4. Improve error messages

### Medium-term (Sprint 3)
1. Background playback
2. Scheduling generation
3. Custom style mixing
4. Advanced analytics

---

## Appendix: Test Data

### Test Repositories
1. `mikeyobrien/ralph-orchestrator` - Python, small (used for validation)
2. `facebook/react` - JavaScript, large
3. `rust-lang/rust` - Rust, very large
4. `vuejs/vue` - TypeScript, medium
5. Private repo (requires GitHub token)

### Test Styles
- Comedy: Humorous narrative with jokes
- Documentary: Informative, educational tone
- Tutorial: Step-by-step explanation
- Fiction: Story-driven narrative
- Podcast: Conversational multi-voice
