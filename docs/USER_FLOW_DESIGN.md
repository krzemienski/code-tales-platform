# Code Tales: User Flow & Design Documentation

## Overview
This document describes the complete user journey through the Code Tales platform, from discovery to story playback.

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CODE TALES USER JOURNEY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐                                                             │
│  │   HOME (/)  │ ◄──── Entry Point                                           │
│  │             │                                                             │
│  │  • Hero     │       ┌──────────────────┐                                  │
│  │  • URL Input│ ────► │ DISCOVER (/discover) │                              │
│  │  • CTA      │       │                      │                              │
│  └──────┬──────┘       │  • Search stories    │                              │
│         │              │  • Trending/Recent   │                              │
│         │              │  • By Language       │                              │
│         ▼              └──────────┬───────────┘                              │
│  ┌─────────────┐                  │                                          │
│  │   LOGIN     │                  │                                          │
│  │ (/auth/login)│                 ▼                                          │
│  │             │       ┌──────────────────────┐                              │
│  │ • Replit    │       │ STORY PLAYER         │                              │
│  │   Auth      │       │ (/story/[id])        │                              │
│  │ • Demo Mode │       │                      │                              │
│  └──────┬──────┘       │  • Audio playback    │                              │
│         │              │  • Chapter nav       │                              │
│         │              │  • Keyboard shortcuts│                              │
│         ▼              │  • Resume playback   │                              │
│  ┌─────────────┐       │  • Mobile responsive │                              │
│  │  DASHBOARD  │       └──────────────────────┘                              │
│  │ (/dashboard)│                                                             │
│  │             │                                                             │
│  │ • My Tales  │       ┌──────────────────────┐                              │
│  │ • Continue  │       │ TALE CREATION WIZARD │                              │
│  │   Listening │ ────► │ (/dashboard/new)     │                              │
│  │ • Stats     │       │                      │                              │
│  └─────────────┘       │  Step 1: Repo Input  │                              │
│                        │    └─ File tree      │                              │
│                        │    └─ Preview        │                              │
│                        │                      │                              │
│                        │  Step 2: Style       │                              │
│                        │    └─ Intent chat    │                              │
│                        │    └─ Quick options  │                              │
│                        │                      │                              │
│                        │  Step 3: Configure   │                              │
│                        │    └─ Duration       │                              │
│                        │    └─ Voice + Preview│                              │
│                        │    └─ Cost estimate  │                              │
│                        │                      │                              │
│                        │  Step 4: Generate    │                              │
│                        │    └─ Progress view  │                              │
│                        │    └─ Telemetry logs │                              │
│                        └──────────────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Screen-by-Screen Breakdown

### 1. Home Page (`/`)

**Purpose:** Landing page that introduces Code Tales and provides quick access to create or discover stories.

**Key Components:**
- **Hero Section**: Animated orb character with headphones
- **GitHub URL Input**: Direct repo-to-tale conversion
- **Navigation**: Tales, Trending, GitHub, Sign In/Up
- **Feature Cards**: Explains the 3-step process

**User Actions:**
1. Paste GitHub URL → Click "Generate Tale" → Redirects to wizard
2. Click "Tales" → Goes to Discover page
3. Click "Sign In" → Goes to Login

**Screenshot:**
![Home Page](/docs/screenshots/home.png)

---

### 2. Discover Page (`/discover`)

**Purpose:** Browse and search community-created code stories.

**Key Components:**
- **Search Bar**: Filter by title, repo, or topic
- **Tab Filters**: Trending, Recent, By Language
- **Story Cards**: Show preview with duration, plays, stars
- **Infinite Scroll**: Load more stories as user scrolls

**Story Card Details:**
- Code snippet preview image
- Style badge (Documentary, Comedy, etc.)
- Language badge (Python, JavaScript, etc.)
- Title and description
- Duration, play count, star count
- Repository source

**User Actions:**
1. Click story card → Opens Story Player
2. Search/filter → Refines results
3. Click "Create Tale" → Goes to Login/Dashboard

---

### 3. Login Page (`/auth/login`)

**Purpose:** Authenticate users via Replit Auth.

**Key Components:**
- **Code Tales Logo**: Branding
- **Sign in with Replit**: Primary OAuth button
- **Demo Mode**: Try without account

**Authentication Flow:**
1. Click "Sign in with Replit"
2. Redirect to Replit OAuth
3. Return to Dashboard on success

---

### 4. Story Player (`/story/[id]`)

**Purpose:** Listen to generated audio stories with full playback controls.

**Key Components:**
- **Story Header**: Repo name, title, description, metadata
- **Animated Orb**: Visual feedback during playback
- **Waveform**: Shows audio visualization
- **Progress Bar**: Scrubbing with time display
- **Playback Controls**:
  - Previous/Next chapter
  - Play/Pause (large center button)
  - Volume slider
  - Playback speed (1x, 1.25x, 1.5x, 2x)
- **Download Button**: Save audio locally
- **Share Button**: Copy link

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| Space | Play/Pause |
| ← | Seek back 10s |
| → | Seek forward 10s |
| ↑ | Volume up 10% |
| ↓ | Volume down 10% |
| M | Mute/Unmute |
| 0-9 | Seek to percentage |

**Mobile Responsive:**
- Stacked layout on small screens
- Icon-only buttons (no text labels)
- Hidden keyboard shortcut hints
- Touch-friendly controls

**Resume Playback:**
- Saves position every 5 seconds to localStorage
- Shows "Resume from X:XX?" prompt on return
- Per-story progress tracking

---

### 5. Dashboard (`/dashboard`)

**Purpose:** User's personal space to manage their tales.

**Sections:**
- **My Tales**: Grid/list of created stories
- **Continue Listening**: In-progress stories
- **Quick Stats**: Total plays, hours generated
- **Trending Community**: Popular public tales

**User Actions:**
1. Click "New Tale" → Opens Creation Wizard
2. Click tale → Opens private player view
3. Click settings → User preferences

---

### 6. Tale Creation Wizard (`/dashboard/new`)

**Purpose:** Step-by-step process to create a new code story.

#### Step 1: Repository Input
**Components:**
- GitHub URL text input
- Validation feedback
- **Repository Tree Preview** (NEW - Sprint 2):
  - Collapsible file structure
  - Important files highlighted (README, package.json, src/)
  - Expand/collapse all
  - File count indicator

**User Actions:**
1. Paste GitHub URL
2. View file tree preview
3. Click "Continue"

#### Step 2: Style Selection
**Components:**
- Primary Style Cards:
  - Comedy: Humorous narrative with jokes
  - Documentary: Educational, informative tone
  - Tutorial: Step-by-step explanation
  - Fiction: Story-driven narrative
  - Podcast: Conversational multi-voice
- Intent Chat: AI conversation to refine story direction
- Quick Options: Pre-built story angles

**User Actions:**
1. Select primary style
2. (Optional) Chat with AI to customize
3. Click "Continue"

#### Step 3: Configuration
**Components:**
- Duration Selector: 5, 10, 15, 20 minutes
- **Voice Selection with Preview** (NEW - Sprint 2):
  - Voice name and description
  - Preview button plays TTS sample
  - Loading state while generating
- **Generation Estimate** (NEW - Sprint 2):
  - Estimated time (e.g., "~2-3 minutes")
  - Estimated cost (Claude + ElevenLabs)
  - Word count estimate

**User Actions:**
1. Select duration
2. Preview and select voice
3. Review cost estimate
4. Click "Generate"

#### Step 4: Generation Progress
**Components:**
- Phase indicator: Analyzing → Generating → Synthesizing → Complete
- Progress percentage
- Telemetry logs (expandable)
- Estimated time remaining
- Cancel button

**States:**
- `queued`: Waiting to start
- `analyzing`: Fetching and parsing repository
- `generating`: Claude AI creating script
- `synthesizing`: ElevenLabs TTS processing
- `completed`: Ready to play
- `failed`: Error with retry option

---

## Sprint Completion Status

### Sprint 1 (Completed)
- [x] Keyboard shortcuts in Story Player
- [x] Resume playback with localStorage
- [x] Mobile-responsive controls
- [x] Fixed hydration warnings

### Sprint 2 (Completed)
- [x] Repository file tree preview
- [x] Voice preview functionality
- [x] Cost/time estimation display
- [x] Fixed intent-chat AI SDK compatibility

### Sprint 3 (Completed)
- [x] Background playback (Media Session API)
- [x] Scheduled generation (draft saving)
- [x] Custom style mixing (2 styles with blend ratio)
- [x] Advanced analytics dashboard

---

## Technical Architecture

### API Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/login` | GET | Initiate Replit OAuth |
| `/api/auth/callback` | GET | OAuth callback handler |
| `/api/auth/logout` | POST | End session |
| `/api/auth/user` | GET | Get current user |
| `/api/stories` | GET/POST | List/create stories |
| `/api/stories/[id]` | GET/PATCH | Get/update story |
| `/api/stories/generate` | POST | Start generation |
| `/api/repositories/tree` | GET | Fetch GitHub file tree |
| `/api/voices/preview` | POST | Generate voice sample |
| `/api/audio` | GET | Serve audio files |

### Database Schema
- `users`: User accounts
- `auth_sessions`: Signed session cookies
- `code_repositories`: Analyzed repos
- `stories`: Generated tales
- `story_chapters`: Audio segments
- `story_intents`: User customizations

### Storage
- **Replit Object Storage**: Private audio files
- **Path Pattern**: `/.private/audio/{storyId}/chunk_XXX.mp3`
- **Served via**: `/api/audio?path=...`

---

## Validated Test Data

### Ralph Wiggum Test Stories (5 stories, 55+ minutes)
1. Ralph Wiggum Comedy Hour - 12 min
2. The Adventures of Ralph Wiggum - 15 min
3. Documentary style variants
4. Tutorial explanations
5. Fiction narratives

### Test Voices Used
- `eleven_flash_v2_5`
- `eleven_multilingual_v2`
- `eleven_turbo_v2_5`

---

## Mobile Responsiveness

All screens are fully responsive:

| Screen | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| Home | Full hero | Stacked layout | Single column |
| Discover | 3-column grid | 2-column grid | Single column |
| Player | Side-by-side | Stacked | Compact controls |
| Dashboard | Grid view | List view | Card stack |
| Wizard | Multi-step | Multi-step | Single step view |

---

*Last Updated: January 10, 2026*
