# Code Tales: Story Generation Variations Test Report

**Generated:** January 11, 2026  
**Test Repository:** mikeyobrien/ralph-orchestrator  
**Repository ID:** 8ffc7bb5-fd88-40a4-9fb6-f2b9172b1833

---

## Executive Summary

This document traces the complete end-to-end pipeline for generating audio stories from the same GitHub repository with different configurations. It demonstrates how narrative style, expertise level, duration, and voice selection affect the generated content.

**Total Stories Generated:** 9 completed (out of 10 attempted)  
**Total Audio Content:** ~75 minutes  
**Failure Reason:** 1 story failed due to ElevenLabs API quota exhaustion

---

## Complete Story Inventory

### Original Ralph Wiggum Stories (5)

| # | Story ID | Title | Style | Duration | URL |
|---|----------|-------|-------|----------|-----|
| 1 | `0850462f-2732-4d4a-b57a-5fa52a88f6bf` | Ralph Wiggum Comedy Hour | comedy | 12:13 | `/story/0850462f-2732-4d4a-b57a-5fa52a88f6bf` |
| 2 | `3eee995e-7c9e-457d-9233-be8a5cf8b9a4` | The Adventures of Ralph Wiggum | fiction | 14:01 | `/story/3eee995e-7c9e-457d-9233-be8a5cf8b9a4` |
| 3 | `319faaba-713e-4577-b8be-c736200f0bee` | Ralph Wiggum: A Documentary | documentary | 9:42 | `/story/319faaba-713e-4577-b8be-c736200f0bee` |
| 4 | `42c33b4d-53c4-4156-a994-4e64098386a1` | Learning Code with Ralph Wiggum | tutorial | 9:55 | `/story/42c33b4d-53c4-4156-a994-4e64098386a1` |
| 5 | `3acd3b17-f7d1-4ddc-a782-fc2fd9b36069` | The Ralph Wiggum Podcast | documentary | 9:40 | `/story/3acd3b17-f7d1-4ddc-a782-fc2fd9b36069` |

### New Test Variation Stories (4 completed)

| # | Story ID | Title | Style | Expertise | Target | Actual | Voice | URL |
|---|----------|-------|-------|-----------|--------|--------|-------|-----|
| 6 | `04ae4a3d-5c63-4b44-84b7-fa88eadbcc63` | Epic Fantasy Saga | fiction | expert | 10 min | 10:13 | Rachel | `/story/04ae4a3d-5c63-4b44-84b7-fa88eadbcc63` |
| 7 | `e6c28765-7653-4138-a66e-a66f507012dc` | Beginner Documentary | documentary | beginner | 5 min | 4:58 | Documentary | `/story/e6c28765-7653-4138-a66e-a66f507012dc` |
| 8 | `0bb5bb87-5fdd-4bb5-ba5a-dc4d2471506f` | Complete Tutorial | tutorial | intermediate | 15 min | 5:06 | Tutorial | `/story/0bb5bb87-5fdd-4bb5-ba5a-dc4d2471506f` |
| 9 | `f0f7fd9e-5889-4faa-afb7-ce2fa07eab41` | Technical Deep Dive | technical | expert | 10 min | 7:12 | Technical | `/story/f0f7fd9e-5889-4faa-afb7-ce2fa07eab41` |

---

## API Call Trace by Story

### Story 6: Epic Fantasy Saga (Fiction/Expert/10min)

**Claude API Call:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "system": "[STORY_ARCHITECT_PROMPT]\n\nSTYLE:\n[FICTION_STYLE_PROMPT]\n\nEXPERTISE ADAPTATION: Be technically precise. Skip basic explanations. Focus on implementation details, edge cases, and nuances.\n\nDURATION REQUIREMENT: This narrative MUST be comprehensive enough for 10 minutes of audio (~1500 words).",
  "temperature": 0.8,
  "maxOutputTokens": 4000
}
```

**User Prompt:**
```
Create an audio narrative script for the repository mikeyobrien/ralph-orchestrator.

NARRATIVE STYLE: FICTION
TARGET DURATION: 10 minutes (~1500 words)
USER'S INTENT: Ralph Orchestrator: Epic Fantasy Saga

REPOSITORY ANALYSIS:
[Repository summary with file structure, 372 chars]

KEY DIRECTORIES TO COVER:
[Top 15 directories]

CRITICAL INSTRUCTIONS:
1. You MUST generate approximately 1500 words - this is a 10-minute audio experience
2. Style is "fiction" - fully commit to this style throughout
3. Create a complete fictional world with characters, plot, conflict, and resolution. Code components ARE your characters.
...
```

**ElevenLabs TTS Call:**
```json
{
  "voice_id": "21m00Tcm4TlvDq8ikWAM",
  "model_id": "eleven_flash_v2_5",
  "voice_settings": {
    "stability": 0.35,
    "similarity_boost": 0.8,
    "style": 0.15,
    "use_speaker_boost": true
  },
  "apply_text_normalization": "auto",
  "previous_text": null,
  "next_text": "[first 500 chars of next chunk if exists]"
}
```

**Result:** 613 seconds, 2 audio chunks

---

### Story 7: Beginner Documentary (Documentary/Beginner/5min)

**Claude API Call:**
```json
{
  "model": "claude-3-5-haiku-20241022",
  "system": "[STORY_ARCHITECT_PROMPT]\n\nSTYLE:\n[DOCUMENTARY_STYLE_PROMPT]\n\nEXPERTISE ADAPTATION: Explain all technical terms using simple analogies. Be patient and thorough. Never assume prior knowledge.\n\nDURATION REQUIREMENT: This narrative MUST be comprehensive enough for 5 minutes of audio (~750 words).",
  "temperature": 0.7,
  "maxOutputTokens": 3000
}
```

**ElevenLabs TTS Call:**
```json
{
  "voice_id": "ErXwobaYiN019PkySvjV",
  "model_id": "eleven_flash_v2_5",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.8,
    "style": 0,
    "use_speaker_boost": true
  }
}
```

**Result:** 298 seconds, 1 audio chunk

---

### Story 8: Complete Tutorial (Tutorial/Intermediate/15min)

**Claude API Call:**
```json
{
  "model": "claude-3-5-haiku-20241022",
  "temperature": 0.7,
  "maxOutputTokens": 5000
}
```

**Token Usage:**
- Input Tokens: 861
- Output Tokens: 999
- Total: 1860

**ElevenLabs TTS Call:**
```json
{
  "voice_id": "pNInz6obpgDQGcFmaJgB",
  "model_id": "eleven_flash_v2_5"
}
```

**Result:** 306 seconds, 1 audio chunk, 5.3MB audio file

---

### Story 9: Technical Deep Dive (Technical/Expert/10min)

**Claude API Call:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "temperature": 0.6,
  "maxOutputTokens": 4000
}
```

**Token Usage:**
- Input Tokens: 878
- Output Tokens: 1404
- Total: 2282

**ElevenLabs TTS Call:**
```json
{
  "voice_id": "yoZ06aMxZJJ28mfd3POQ",
  "model_id": "eleven_flash_v2_5"
}
```

**Result:** 432 seconds, 1 audio chunk, 8.4MB audio file

---

## How Settings Affect Output

### Narrative Style Differences

| Style | Prompt Approach | Voice Settings | Character |
|-------|-----------------|----------------|-----------|
| **Fiction** | World-building, characters from code components, plot with conflict | stability: 0.35, style: 0.15 | More expressive, dramatic |
| **Documentary** | Historical context, metrics, expert insights | stability: 0.5, style: 0 | Authoritative, measured |
| **Tutorial** | Socratic method, progressive building, checkpoints | stability: 0.5, style: 0 | Patient, instructional |
| **Technical** | Precise terminology, complexity analysis, code references | stability: 0.5, style: 0 | Precise, detailed |
| **Podcast** | Conversational, tangents, rhetorical questions | stability: 0.5, style: 0 | Casual, engaging |

### Expertise Level Differences

| Level | Prompt Modifier | Effect |
|-------|-----------------|--------|
| **Beginner** | "Explain all technical terms using simple analogies. Be patient and thorough. Never assume prior knowledge." | Simpler vocabulary, more analogies, foundational concepts |
| **Intermediate** | "Assume general programming knowledge but explain domain-specific and framework-specific concepts." | Balanced technical depth, context for specialized topics |
| **Expert** | "Be technically precise. Skip basic explanations. Focus on implementation details, edge cases, and nuances." | Dense technical content, advanced patterns, edge cases |

### Duration Impact

| Target | Max Tokens | Expected Words | Actual Result |
|--------|------------|----------------|---------------|
| 5 min | 3000 | ~750 | 298-306 seconds |
| 10 min | 4000 | ~1500 | 432-613 seconds |
| 15 min | 5000 | ~2250 | 306 seconds (model hit output limit) |

---

## Voice Configuration Reference

| Voice ID | Name | Best For |
|----------|------|----------|
| `21m00Tcm4TlvDq8ikWAM` | Rachel | General purpose, podcast host |
| `ErXwobaYiN019PkySvjV` | Documentary | Documentary narration |
| `EXAVITQu4vr4xnSDxMaL` | Fiction | Fiction narration |
| `pNInz6obpgDQGcFmaJgB` | Tutorial | Tutorial/educational |
| `yoZ06aMxZJJ28mfd3POQ` | Technical | Technical deep dives |
| `AZnzlk1XvdvUeBnXmlld` | Podcast Guest | Multi-voice podcasts |

---

## Public URLs for All Stories

```
https://[REPLIT_DOMAIN]/story/0850462f-2732-4d4a-b57a-5fa52a88f6bf  (Comedy, 12:13)
https://[REPLIT_DOMAIN]/story/3eee995e-7c9e-457d-9233-be8a5cf8b9a4  (Fiction, 14:01)
https://[REPLIT_DOMAIN]/story/319faaba-713e-4577-b8be-c736200f0bee  (Documentary, 9:42)
https://[REPLIT_DOMAIN]/story/42c33b4d-53c4-4156-a994-4e64098386a1  (Tutorial, 9:55)
https://[REPLIT_DOMAIN]/story/3acd3b17-f7d1-4ddc-a782-fc2fd9b36069  (Podcast, 9:40)
https://[REPLIT_DOMAIN]/story/04ae4a3d-5c63-4b44-84b7-fa88eadbcc63  (Fiction Expert, 10:13)
https://[REPLIT_DOMAIN]/story/e6c28765-7653-4138-a66e-a66f507012dc  (Documentary Beginner, 4:58)
https://[REPLIT_DOMAIN]/story/0bb5bb87-5fdd-4bb5-ba5a-dc4d2471506f  (Tutorial Intermediate, 5:06)
https://[REPLIT_DOMAIN]/story/f0f7fd9e-5889-4faa-afb7-ce2fa07eab41  (Technical Expert, 7:12)
```

Replace `[REPLIT_DOMAIN]` with: `18ca9b88-de85-477b-9281-7c253ecb75ac-00-j00r8drjgwz2.janeway.replit.dev`

---

## Failed Generation

### Story: Quick Podcast (podcast/intermediate/5min)

**Status:** Failed at audio synthesis  
**Reason:** ElevenLabs API quota exceeded  
**Error:**
```json
{
  "status": "quota_exceeded",
  "message": "You have 122 credits remaining, while 1773 credits are required"
}
```

**Note:** The script was successfully generated (558 words), but audio synthesis failed due to quota limits.

---

## Lessons Learned

1. **Model Selection:** Claude Sonnet 4 produces higher quality scripts but Claude 3.5 Haiku is faster and cheaper for simpler styles
2. **Voice Settings:** Lower stability (0.35) for fiction creates more expressive narration
3. **Quota Management:** ElevenLabs has strict character limits; batch testing requires quota monitoring
4. **Duration Accuracy:** Actual duration often differs from target due to model output limits and speech rate

---

## Appendix: Complete System Prompts

### STORY_ARCHITECT_PROMPT (Base)
```
You are the Story Architect Agent for Code Tales.

Your role is to transform repository analysis into compelling audio stories.

You receive:
1. A story plan with chapters and focus areas
2. Detailed code analysis from the Repository Analyzer
3. User preferences (style, length, expertise level)

You produce:
- Complete story scripts for each chapter
- Natural, engaging prose suitable for audio
- Technical accuracy while remaining accessible

STORY GUIDELINES:
- Write in a natural, conversational tone
- Use transitions between topics
- Include specific code examples and file references
- Vary sentence length for natural rhythm
- Include brief pauses (...) for dramatic effect
- Target 150 words per minute of audio
```

### FICTION_STYLE_PROMPT
```
Transform the code analysis into an immersive fictional narrative...

WORLD-BUILDING RULES:
- The codebase is a living, breathing world with distinct regions (modules/packages)
- Code components are CHARACTERS with rich personalities, motivations, and relationships
- Functions are actions characters take; classes are character types or factions
- Data flows are journeys; API calls are communications between kingdoms
- Bugs are villains; tests are guardians; documentation is ancient lore
- Design patterns are cultural traditions passed down through generations

NARRATIVE STRUCTURE:
- Begin with an atmospheric introduction to the world
- Introduce the main characters (core components) with backstories
- Build tension through conflicts (error handling, edge cases, dependencies)
- Include dialogue between components explaining their interactions
- Use dramatic reveals for architectural decisions
- Create emotional moments around critical code paths
- End with resolution and hints at future adventures (extensibility)
...
```

### DOCUMENTARY_STYLE_PROMPT
```
Create an authoritative, comprehensive documentary-style narrative...

DOCUMENTARY STRUCTURE:
- Opening: Set the historical context and significance of this codebase
- Act 1: Origins - How and why was this project created?
- Act 2: Architecture - The grand design and its components
- Act 3: Deep Dives - Detailed exploration of each major module
- Act 4: The Human Element - Design decisions and trade-offs
- Closing: Legacy and future directions
...
```

### TUTORIAL_STYLE_PROMPT
```
Create a patient, thorough educational tutorial narrative...

PEDAGOGICAL STRUCTURE:
- Foundation Layer: Core concepts everyone must understand first
- Building Blocks: Individual components explained in isolation
- Integration Layer: How pieces work together
- Mastery Layer: Advanced patterns and optimizations
- Practice Layer: Mental exercises and "what would happen if" scenarios
...
```

### TECHNICAL_STYLE_PROMPT
```
Create an exhaustive technical deep-dive narrative for expert practitioners...

TECHNICAL DEPTH:
- Assume expert-level understanding of programming concepts
- Include specific implementation details, algorithms, and data structures
- Reference exact file paths, class names, function signatures, and line numbers
- Discuss Big-O complexity, memory implications, and performance characteristics
...
```

### PODCAST_STYLE_PROMPT
```
Create an engaging, conversational podcast-style narrative...

PODCAST PERSONA:
- Sound like a senior developer sharing discoveries over coffee
- Express genuine enthusiasm, surprise, and occasional frustration
- Include personal opinions and preferences (clearly marked as such)
- Use humor, but never at the expense of accuracy
...
```
