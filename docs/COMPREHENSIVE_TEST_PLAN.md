# Code Tales - Comprehensive Functional Test Plan

**Created:** January 12, 2026
**Version:** 1.1
**Total Tests:** 88 functional tests across all user flows

---

## Executive Summary

This document defines a comprehensive testing strategy covering all screens, user flows, API endpoints, and generation modes in the Code Tales platform. Each test includes specific verification criteria and expected outcomes.

---

## Test Categories Overview

| Category | Test Count | Priority |
|----------|------------|----------|
| Landing Page & Navigation | 8 | High |
| Authentication Flow | 6 | Critical |
| Dashboard Features | 10 | High |
| Story Creation Wizard | 12 | Critical |
| Generation Pipeline (Hybrid) | 8 | Critical |
| Generation Pipeline (Studio) | 8 | High |
| Comparison Mode | 6 | Medium |
| Story Player | 12 | Critical |
| Discover/Community | 5 | Medium |
| API Endpoints | 10 | High |
| Repository Caching | 3 | Medium |
| **Total** | **88** | |

---

## 1. Landing Page & Navigation Tests

### T1.1: Homepage Hero Section
**Route:** `/`
**Steps:**
1. Navigate to homepage
2. Verify hero text "Transform Your Code Into Audio Stories" is visible
3. Verify GitHub URL input field is present
4. Verify "Create Your Story" CTA button exists

**Expected:** Hero section loads with all elements visible
**Screenshot Required:** Yes

---

### T1.2: GitHub URL Input Validation
**Route:** `/`
**Steps:**
1. Enter invalid URL (e.g., "not-a-url")
2. Click submit
3. Verify error message appears
4. Enter valid GitHub URL (e.g., "https://github.com/facebook/react")
5. Click submit

**Expected:** Invalid URLs show error; valid URLs proceed
**Screenshot Required:** Yes (error state)

---

### T1.3: Navigation Bar Elements
**Route:** `/` (all pages)
**Steps:**
1. Verify Code Tales logo/brand is visible
2. Verify "Discover" link exists
3. Verify "Dashboard" link exists (when logged in)
4. Verify Login/Logout button based on auth state

**Expected:** Navigation consistent across all pages
**Screenshot Required:** Yes

---

### T1.4: Footer Links
**Route:** `/`
**Steps:**
1. Scroll to footer
2. Verify documentation links work
3. Verify social/community links if present

**Expected:** All footer links functional
**Screenshot Required:** No

---

### T1.5: Mobile Responsive Layout
**Route:** `/`
**Steps:**
1. Resize viewport to 375px width
2. Verify hamburger menu appears
3. Verify hero stacks vertically
4. Verify input field remains usable

**Expected:** Mobile layout adapts properly
**Screenshot Required:** Yes (mobile view)

---

### T1.6: Theme Toggle (Dark/Light)
**Route:** `/`
**Steps:**
1. Locate theme toggle if present
2. Toggle between dark and light modes
3. Verify colors change appropriately

**Expected:** Theme switches correctly
**Screenshot Required:** Yes (both modes)

---

### T1.7: Navigation to Discover Page
**Route:** `/` → `/discover`
**Steps:**
1. Click "Discover" navigation link
2. Verify redirect to /discover
3. Verify public stories grid loads

**Expected:** Smooth navigation to discover page
**Screenshot Required:** Yes

---

### T1.8: Documentation Page Access
**Route:** `/docs`
**Steps:**
1. Navigate to /docs
2. Verify documentation content loads
3. Check navigation between doc sections

**Expected:** Documentation is accessible and readable
**Screenshot Required:** Yes

---

## 2. Authentication Flow Tests

### T2.1: Login Button Visibility (Logged Out)
**Route:** `/`
**Steps:**
1. Ensure logged out state
2. Verify "Login" or "Sign In with Replit" button visible

**Expected:** Login button visible when not authenticated
**Screenshot Required:** Yes

---

### T2.2: Replit OAuth Redirect
**Route:** `/api/auth/login`
**Steps:**
1. Click login button
2. Verify redirect to Replit authorization page
3. Verify return URL is stored

**Expected:** Proper OAuth flow initiation
**Screenshot Required:** No (external redirect)

---

### T2.3: OAuth Callback Handling
**Route:** `/api/auth/callback`
**Steps:**
1. Complete Replit OAuth flow
2. Verify callback creates/updates user record
3. Verify session cookie is set
4. Verify redirect to dashboard

**Expected:** User authenticated and redirected
**Screenshot Required:** No

---

### T2.4: User Profile Display
**Route:** `/dashboard`
**Steps:**
1. Log in successfully
2. Verify user avatar appears in navbar
3. Verify user name displayed
4. Click avatar for dropdown menu

**Expected:** User profile information visible
**Screenshot Required:** Yes

---

### T2.5: Logout Flow
**Route:** `/api/auth/logout`
**Steps:**
1. Click logout button
2. Verify session destroyed
3. Verify redirect to homepage
4. Verify login button reappears

**Expected:** Clean logout with session cleared
**Screenshot Required:** No

---

### T2.6: Protected Route Redirect
**Route:** `/dashboard` (when logged out)
**Steps:**
1. Ensure logged out
2. Navigate directly to /dashboard
3. Verify redirect to login page
4. After login, verify return to dashboard

**Expected:** Protected routes redirect to login
**Screenshot Required:** No

---

## 3. Dashboard Features Tests

### T3.1: Dashboard Initial Load
**Route:** `/dashboard`
**Steps:**
1. Log in and navigate to dashboard
2. Verify Tali mascot greeting displays
3. Verify "Create New Tale" button present
4. Verify stories grid loads

**Expected:** Dashboard loads with all sections
**Screenshot Required:** Yes

---

### T3.2: Stories Grid Display
**Route:** `/dashboard`
**Steps:**
1. Verify story cards show title, style, duration
2. Verify status badges (completed, processing, failed)
3. Verify play count if applicable
4. Verify created date

**Expected:** Story cards display complete information
**Screenshot Required:** Yes

---

### T3.3: Continue Listening Section
**Route:** `/dashboard`
**Steps:**
1. Partially play a story
2. Return to dashboard
3. Verify "Continue Listening" section appears
4. Verify progress bar shows position
5. Click resume and verify playback position

**Expected:** Resume playback from last position
**Screenshot Required:** Yes

---

### T3.4: Story Card Actions Menu
**Route:** `/dashboard`
**Steps:**
1. Click actions menu (three dots) on story card
2. Verify options: Play, View Pipeline, Edit, Download, Share, Delete
3. Test each action works correctly

**Expected:** All action menu items functional
**Screenshot Required:** Yes

---

### T3.5: Drafts Section Display
**Route:** `/dashboard`
**Steps:**
1. Create a draft (save without generating)
2. Return to dashboard
3. Verify drafts section shows saved draft
4. Verify draft shows repository URL and config

**Expected:** Drafts visible and resumable
**Screenshot Required:** Yes

---

### T3.6: Draft Resume Workflow
**Route:** `/dashboard` → `/dashboard/new`
**Steps:**
1. Click "Edit" on a saved draft
2. Verify wizard opens with saved configuration
3. Verify repository is pre-filled
4. Verify style settings preserved

**Expected:** Draft configuration restored
**Screenshot Required:** Yes

---

### T3.7: Draft Deletion
**Route:** `/dashboard`
**Steps:**
1. Click delete on a draft
2. Verify confirmation dialog
3. Confirm deletion
4. Verify draft removed from list

**Expected:** Draft deleted after confirmation
**Screenshot Required:** No

---

### T3.8: Analytics Page Load
**Route:** `/dashboard/analytics`
**Steps:**
1. Navigate to analytics page
2. Verify summary statistics display
3. Verify charts render (if stories exist)
4. Verify insights section

**Expected:** Analytics data displays correctly
**Screenshot Required:** Yes

---

### T3.9: Settings Page
**Route:** `/dashboard/settings`
**Steps:**
1. Navigate to settings
2. Verify profile section
3. Verify default preferences
4. Verify theme toggle

**Expected:** Settings page loads with options
**Screenshot Required:** Yes

---

### T3.10: Trending Community Section
**Route:** `/dashboard`
**Steps:**
1. Scroll to trending section
2. Verify public stories from other users display
3. Verify play counts shown
4. Click story to navigate to player

**Expected:** Community stories visible on dashboard
**Screenshot Required:** Yes

---

## 4. Story Creation Wizard Tests

### T4.1: Wizard Step 1 - Repository Selection
**Route:** `/dashboard/new`
**Steps:**
1. Click "Create New Tale"
2. Verify step 1 loads with URL input
3. Enter valid GitHub URL
4. Click "Analyze Repository"
5. Verify loading state during analysis
6. Verify repository info displays after analysis

**Expected:** Repository analyzed and info displayed
**Screenshot Required:** Yes

---

### T4.2: Repository Analysis Results
**Route:** `/dashboard/new`
**Steps:**
1. After analysis, verify:
   - Repository name and owner
   - Primary language detected
   - Stars/forks count
   - File tree structure
   - README preview if available

**Expected:** Complete repository analysis shown
**Screenshot Required:** Yes

---

### T4.3: Invalid Repository Handling
**Route:** `/dashboard/new`
**Steps:**
1. Enter non-existent repository URL
2. Click analyze
3. Verify error message
4. Enter private repository URL
5. Verify appropriate error

**Expected:** Clear error messages for invalid repos
**Screenshot Required:** Yes

---

### T4.4: Wizard Step 2 - Style Selection
**Route:** `/dashboard/new`
**Steps:**
1. Complete step 1
2. Proceed to step 2
3. Verify style options: Fiction, Documentary, Tutorial, Technical, Podcast
4. Click each style, verify selection
5. Verify style description/preview updates

**Expected:** All narrative styles selectable
**Screenshot Required:** Yes

---

### T4.5: Style Characteristics Preview
**Route:** `/dashboard/new`
**Steps:**
1. Select each narrative style
2. Verify characteristics preview updates
3. Verify sample text or description shown

**Expected:** Style previews informative
**Screenshot Required:** Yes

---

### T4.6: Duration Slider Configuration
**Route:** `/dashboard/new`
**Steps:**
1. Find duration slider
2. Adjust to minimum (e.g., 3 min)
3. Verify value updates
4. Adjust to maximum (e.g., 30 min)
5. Verify value updates

**Expected:** Duration slider works with clear feedback
**Screenshot Required:** Yes

---

### T4.7: Expertise Level Selection
**Route:** `/dashboard/new`
**Steps:**
1. Find expertise level selector
2. Select Beginner
3. Select Intermediate
4. Select Expert
5. Verify selection persists

**Expected:** All expertise levels selectable
**Screenshot Required:** Yes

---

### T4.8: Wizard Step 3 - Voice Selection
**Route:** `/dashboard/new`
**Steps:**
1. Proceed to voice selection step
2. Verify voice list loads from ElevenLabs
3. Verify voice cards show name and preview button
4. Click preview to play sample
5. Select a voice

**Expected:** Voices load and preview plays
**Screenshot Required:** Yes

---

### T4.9: Voice Preview Playback
**Route:** `/dashboard/new`
**Steps:**
1. Click preview button on voice card
2. Verify audio sample plays
3. Verify can preview multiple voices

**Expected:** Voice previews functional
**Screenshot Required:** No (audio test)

---

### T4.10: Generation Mode Selection
**Route:** `/dashboard/new`
**Steps:**
1. Find generation mode selector
2. Verify options: Hybrid, Studio Podcast, Studio Audiobook
3. Select each mode
4. Verify mode-specific options appear/hide

**Expected:** Generation modes selectable with appropriate UI
**Screenshot Required:** Yes

---

### T4.11: Story Title Input
**Route:** `/dashboard/new`
**Steps:**
1. Find story title field
2. Enter custom title
3. Verify title saved
4. Leave blank to test auto-generation

**Expected:** Title input works, auto-generation fallback
**Screenshot Required:** No

---

### T4.12: Save as Draft Functionality
**Route:** `/dashboard/new`
**Steps:**
1. Configure story (step 1-3)
2. Click "Save as Draft"
3. Verify success message
4. Navigate to dashboard
5. Verify draft appears

**Expected:** Draft saved and visible on dashboard
**Screenshot Required:** Yes

---

## 5. Generation Pipeline (Hybrid Mode) Tests

### T5.1: Start Hybrid Generation
**Route:** `/dashboard/new` → Pipeline
**Steps:**
1. Configure story with Hybrid mode selected
2. Click "Generate Story"
3. Verify pipeline dashboard opens
4. Verify story record created

**Expected:** Generation starts with pipeline visibility
**Screenshot Required:** Yes

---

### T5.2: Pipeline Stage Timeline
**Route:** Pipeline Dashboard
**Steps:**
1. During generation, verify stage timeline:
   - Repository Analysis (blue/running)
   - Script Generation (pending → running)
   - Audio Synthesis (pending)
2. Verify stages transition correctly

**Expected:** Timeline shows accurate stage progression
**Screenshot Required:** Yes (multiple stages)

---

### T5.3: Live Log Streaming (SSE)
**Route:** Pipeline Dashboard
**Steps:**
1. During generation, observe log panel
2. Verify logs stream in real-time
3. Verify log levels (info, warn, error)
4. Verify agent names shown

**Expected:** Live logs stream without refresh
**Screenshot Required:** Yes

---

### T5.4: Token Usage Display
**Route:** Pipeline Dashboard
**Steps:**
1. During/after script generation stage
2. Verify input tokens displayed
3. Verify output tokens displayed
4. Verify cached tokens if applicable

**Expected:** Token metrics visible
**Screenshot Required:** Yes

---

### T5.5: Cost Estimate Display
**Route:** Pipeline Dashboard
**Steps:**
1. After script generation
2. Verify cost estimate calculated
3. Verify reasonable estimate shown

**Expected:** Cost estimate displayed
**Screenshot Required:** Yes

---

### T5.6: Prompt Preview
**Route:** Pipeline Dashboard
**Steps:**
1. Click to expand prompt preview
2. Verify system prompt visible
3. Verify user prompt visible
4. Verify variables substituted

**Expected:** Prompt content viewable
**Screenshot Required:** Yes

---

### T5.7: Audio Synthesis Progress
**Route:** Pipeline Dashboard
**Steps:**
1. During audio synthesis stage
2. Verify chunk progress (e.g., "Chunk 1 of 2")
3. Verify ElevenLabs API call logged

**Expected:** Audio synthesis progress visible
**Screenshot Required:** Yes

---

### T5.8: Generation Completion
**Route:** Pipeline Dashboard → Story Page
**Steps:**
1. Wait for generation to complete
2. Verify "Completed" status shown
3. Verify "Play Story" button appears
4. Click to navigate to story player
5. Verify audio plays

**Expected:** Smooth transition to playback
**Screenshot Required:** Yes

---

## 6. Generation Pipeline (Studio Mode) Tests

### T6.1: Start Studio Podcast Generation
**Route:** `/dashboard/new` → Pipeline
**Steps:**
1. Select "Studio - Podcast" mode
2. Configure voices (host, guest if applicable)
3. Click Generate
4. Verify Studio API called

**Expected:** GenFM podcast creation initiated
**Screenshot Required:** Yes

---

### T6.2: Studio Project Status Polling
**Route:** Pipeline Dashboard
**Steps:**
1. During Studio generation
2. Verify project status polls
3. Verify conversion progress updates

**Expected:** Status updates without refresh
**Screenshot Required:** Yes

---

### T6.3: Studio Webhook Handling
**Route:** `/api/webhooks/elevenlabs`
**Steps:**
1. During Studio generation
2. Verify webhook received on completion
3. Verify story status updated
4. Verify audio URL populated

**Expected:** Webhook triggers status update
**Screenshot Required:** No (backend)

---

### T6.4: Start Studio Audiobook Generation
**Route:** `/dashboard/new` → Pipeline
**Steps:**
1. Select "Studio - Audiobook" mode
2. Select narrator voice
3. Click Generate
4. Verify Audiobook API called

**Expected:** Audiobook project created
**Screenshot Required:** Yes

---

### T6.5: Studio Mode Audio Download
**Route:** Pipeline Dashboard
**Steps:**
1. After Studio generation completes
2. Verify audio downloaded from ElevenLabs
3. Verify stored in object storage
4. Verify playable

**Expected:** Audio retrieved and stored
**Screenshot Required:** No

---

### T6.6: Studio Mode Error Handling
**Route:** Pipeline Dashboard
**Steps:**
1. Simulate Studio API error (e.g., quota)
2. Verify error message displayed
3. Verify retry option if applicable

**Expected:** Clear error with recovery option
**Screenshot Required:** Yes

---

## 7. Comparison Mode Tests

### T7.1: Start Comparison Generation
**Route:** `/dashboard/new`
**Steps:**
1. Select "Compare" generation mode
2. Configure shared settings
3. Click Generate
4. Verify both Hybrid and Studio start

**Expected:** Dual generation initiated
**Screenshot Required:** Yes

---

### T7.2: Side-by-Side Pipeline View
**Route:** Comparison Pipeline
**Steps:**
1. During comparison generation
2. Verify two pipeline columns visible
3. Verify both update independently
4. Verify can compare progress

**Expected:** Side-by-side visibility
**Screenshot Required:** Yes

---

### T7.3: Comparison Results Display
**Route:** Comparison Results
**Steps:**
1. After both complete
2. Verify metrics comparison table
3. Verify cost comparison
4. Verify duration comparison

**Expected:** Clear metrics comparison
**Screenshot Required:** Yes

---

### T7.4: Comparison Audio Playback
**Route:** Comparison Results
**Steps:**
1. Play Hybrid audio
2. Play Studio audio
3. Toggle between both
4. Verify both functional

**Expected:** Both audio versions playable
**Screenshot Required:** Yes

---

## 8. Story Player Tests

### T8.1: Player Page Load
**Route:** `/story/[id]`
**Steps:**
1. Navigate to completed story
2. Verify player loads
3. Verify story title displayed
4. Verify duration shown
5. Verify play button present

**Expected:** Player fully loaded
**Screenshot Required:** Yes

---

### T8.2: Audio Playback Start
**Route:** `/story/[id]`
**Steps:**
1. Click play button
2. Verify audio starts
3. Verify progress bar moves
4. Verify time updates

**Expected:** Audio plays correctly
**Screenshot Required:** No (audio test)

---

### T8.3: Play/Pause Toggle
**Route:** `/story/[id]`
**Steps:**
1. Click play to start
2. Click pause
3. Verify audio pauses
4. Click play again
5. Verify resumes from position

**Expected:** Play/pause toggles correctly
**Screenshot Required:** No

---

### T8.4: Progress Bar Seeking
**Route:** `/story/[id]`
**Steps:**
1. Start playback
2. Click on progress bar to seek
3. Verify audio jumps to position
4. Drag progress bar
5. Verify smooth seeking

**Expected:** Seeking works accurately
**Screenshot Required:** No

---

### T8.5: Volume Control
**Route:** `/story/[id]`
**Steps:**
1. Find volume slider
2. Adjust volume down
3. Verify audio quieter
4. Adjust volume up
5. Test mute button if present

**Expected:** Volume control functional
**Screenshot Required:** No

---

### T8.6: Multi-Chunk Navigation
**Route:** `/story/[id]` (multi-chunk story)
**Steps:**
1. Play story with multiple chunks
2. Verify "Part 1 of 2" indicator
3. Wait for chunk transition
4. Verify seamless transition

**Expected:** Chunks transition smoothly
**Screenshot Required:** Yes (chunk indicator)

---

### T8.7: Chapter Navigation
**Route:** `/story/[id]` (with chapters)
**Steps:**
1. Find chapter list/markers
2. Click on chapter 3
3. Verify audio seeks to chapter start
4. Verify chapter highlighted

**Expected:** Chapter navigation works
**Screenshot Required:** Yes

---

### T8.8: Playback Position Persistence
**Route:** `/story/[id]` → Leave → Return
**Steps:**
1. Play to 50% position
2. Navigate away from page
3. Return to story
4. Verify resumes from saved position

**Expected:** Position saved and restored
**Screenshot Required:** No

---

### T8.9: Floating Player Persistence
**Route:** `/story/[id]` → Navigate
**Steps:**
1. Start playback
2. Navigate to another page (e.g., /discover)
3. Verify floating player appears
4. Verify audio continues
5. Verify can control from floating player

**Expected:** Floating player maintains playback
**Screenshot Required:** Yes

---

### T8.10: Audio Download
**Route:** `/story/[id]`
**Steps:**
1. Find download button
2. Click download
3. Verify MP3 file downloads
4. Verify file plays in external player

**Expected:** Audio downloadable
**Screenshot Required:** No

---

## 9. Discover/Community Tests

### T9.1: Discover Page Load
**Route:** `/discover`
**Steps:**
1. Navigate to /discover
2. Verify public stories grid loads
3. Verify story cards show info
4. Verify pagination if many stories

**Expected:** Public stories displayed
**Screenshot Required:** Yes

---

### T9.2: Story Filtering
**Route:** `/discover`
**Steps:**
1. Find filter controls
2. Filter by narrative style
3. Verify results update
4. Filter by language if available

**Expected:** Filtering works correctly
**Screenshot Required:** Yes

---

### T9.3: Story Search
**Route:** `/discover`
**Steps:**
1. Find search input
2. Search for repository name
3. Verify matching stories shown
4. Search for non-existent term
5. Verify "no results" message

**Expected:** Search functional with feedback
**Screenshot Required:** Yes

---

### T9.4: Public Story Playback
**Route:** `/discover` → `/story/[id]`
**Steps:**
1. Click on public story
2. Verify player loads
3. Verify can play without login
4. Verify play count increments

**Expected:** Public stories playable by anyone
**Screenshot Required:** No

---

### T9.5: Story Sharing
**Route:** `/story/[id]` (own story)
**Steps:**
1. Click share button
2. Verify shareable link generated
3. Copy link
4. Open in incognito
5. Verify story accessible

**Expected:** Share links work for public stories
**Screenshot Required:** Yes

---

## 10. API Endpoint Tests

### T10.1: GET /api/voices
**Steps:**
1. Call /api/voices
2. Verify returns voice list
3. Verify each voice has id, name
4. Verify preview URLs if available

**Expected:** Voice data returned
**Response Check:** JSON array with voice objects

---

### T10.2: GET /api/models
**Steps:**
1. Call /api/models
2. Verify returns AI model list
3. Verify models have id, name, capabilities

**Expected:** Model data returned
**Response Check:** JSON with model options

---

### T10.3: GET /api/auth/user (Authenticated)
**Steps:**
1. Log in
2. Call /api/auth/user
3. Verify returns user object
4. Verify includes id, email, name

**Expected:** Current user data returned
**Response Check:** User object with profile

---

### T10.4: GET /api/stories (User's Stories)
**Steps:**
1. Log in
2. Call /api/stories
3. Verify returns user's stories
4. Verify pagination works

**Expected:** User stories list returned
**Response Check:** Array of story objects

---

### T10.5: GET /api/audio?path=...
**Steps:**
1. Get audio path from story
2. Call /api/audio with path
3. Verify audio data returned
4. Verify correct content-type

**Expected:** Audio file streamed
**Response Check:** audio/mpeg content type

---

### T10.6: POST /api/stories/generate (Invalid Input)
**Steps:**
1. POST with missing required fields
2. Verify 400 error returned
3. Verify error message helpful
4. POST with invalid repository
5. Verify appropriate error

**Expected:** Validation errors clear
**Response Check:** Error response with details

---

### T10.7: GET /api/audio Range Requests
**Steps:**
1. Get audio path from story
2. Call /api/audio with Range header (bytes=0-1000)
3. Verify 206 Partial Content response
4. Verify Content-Range header present
5. Test seeking with different byte ranges

**Expected:** Range requests supported for seeking
**Response Check:** 206 status, Accept-Ranges: bytes

---

### T10.8: POST /api/stories/generate-compare
**Steps:**
1. Log in
2. POST with valid repository and config
3. Verify returns two story IDs (hybrid and studio)
4. Verify both generation pipelines start
5. Check both stories exist in database

**Expected:** Comparison mode creates dual stories
**Response Check:** { hybridStoryId, studioStoryId }

---

### T10.9: GET /api/stories/[id]/stages
**Steps:**
1. Get story that's processing or completed
2. Call /api/stories/[id]/stages
3. Verify returns array of stage objects
4. Verify each stage has name, status, duration_ms

**Expected:** Pipeline stages data returned
**Response Check:** Array with stage metadata

---

### T10.10: POST /api/webhooks/elevenlabs
**Steps:**
1. Simulate ElevenLabs webhook payload
2. Verify webhook updates story status
3. Verify audio URL populated
4. Verify studio_projects table updated

**Expected:** Webhook processing works
**Response Check:** 200 OK acknowledgment

---

## 11. Repository Caching Tests

### T11.1: Repository Cache Creation
**Route:** `/dashboard/new`
**Steps:**
1. Analyze a new repository
2. Verify code_repositories entry created
3. Verify analysis_cache populated
4. Verify analysis_cached_at timestamp set

**Expected:** Repository cached on first analysis
**Screenshot Required:** No

---

### T11.2: Repository Cache Hit
**Route:** `/dashboard/new`
**Steps:**
1. Analyze same repository again
2. Verify cache is used (faster response)
3. Verify no new GitHub API calls made
4. Check logs for "cache hit" message

**Expected:** Cached analysis reused
**Screenshot Required:** No

---

### T11.3: Repository Cache Invalidation
**Route:** `/dashboard/new`
**Steps:**
1. Analyze repository
2. Wait for cache to expire (if time-based)
3. Or trigger manual refresh
4. Verify fresh analysis fetched

**Expected:** Stale cache refreshed
**Screenshot Required:** No

---

## 12. Additional Studio Mode Tests

### T6.7: Studio Webhook Failure Handling
**Route:** Pipeline Dashboard
**Steps:**
1. Start Studio generation
2. Simulate webhook timeout
3. Verify fallback polling activates
4. Verify story eventually completes or shows error

**Expected:** Graceful handling of webhook failures
**Screenshot Required:** Yes

---

### T6.8: Studio Mode Quota Check
**Route:** `/dashboard/new`
**Steps:**
1. Check ElevenLabs quota before generation
2. If quota low, verify warning displayed
3. If quota exhausted, verify generation blocked with message

**Expected:** Clear quota feedback before generation
**Screenshot Required:** Yes

---

## 13. Additional Comparison Mode Tests

### T7.5: Live Comparison Pipeline UI
**Route:** Comparison Pipeline Dashboard
**Steps:**
1. Start comparison generation
2. Verify split-screen layout
3. Verify Hybrid column shows all stages
4. Verify Studio column shows all stages
5. Verify independent progress tracking

**Expected:** Real-time dual pipeline visibility
**Screenshot Required:** Yes

---

### T7.6: Comparison Mode Metrics Table
**Route:** Comparison Results
**Steps:**
1. After both generations complete
2. Verify metrics table shows:
   - Generation time comparison
   - Token usage comparison
   - Cost comparison
   - Audio duration comparison
3. Verify winner highlighted

**Expected:** Clear metrics comparison display
**Screenshot Required:** Yes

---

## 14. Additional Story Player Tests

### T8.11: Floating Player Persistence
**Route:** `/story/[id]` → Navigate Away
**Steps:**
1. Start playing a story
2. Navigate to /discover
3. Verify floating player appears at bottom
4. Verify audio continues playing
5. Navigate to /dashboard
6. Verify floating player still visible

**Expected:** Floating player persists across navigation
**Screenshot Required:** Yes

---

### T8.12: Background Audio Playback
**Route:** `/story/[id]`
**Steps:**
1. Start audio playback
2. Switch to another browser tab
3. Verify audio continues playing
4. Return to tab
5. Verify controls synced with playback position

**Expected:** Audio plays in background without interruption
**Screenshot Required:** No

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Verify server running on port 5000
- [ ] Verify database connected
- [ ] Verify ElevenLabs API key configured
- [ ] Verify Anthropic API key configured
- [ ] Clear any cached data if needed

### Execution Priority
1. **Critical Path (T2, T4, T5, T8):** Authentication → Creation → Generation → Playback
2. **High Priority (T1, T3, T10):** Navigation, Dashboard, APIs
3. **Medium Priority (T6, T7, T9):** Studio Mode, Comparison, Community

### Reporting
For each test, record:
- Pass/Fail status
- Screenshot if required
- Any bugs found
- Performance observations

---

## Appendix: Known Issues to Verify

From previous test reports:
1. Model selection bug (Tutorial selected wrong provider) - **Verify fixed**
2. Audio URL conversion issues - **Verify fixed**
3. Storage public access prevention - **Verify working**
4. 15-minute duration hitting token limits - **Document behavior**

---

*Document Version: 1.1 | Last Updated: January 12, 2026*
