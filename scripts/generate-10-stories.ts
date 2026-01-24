/**
 * CODE TALES - 10 STORY VARIATIONS TEST
 * 
 * This script generates 10 different story variations from the same repository
 * (ralph-orchestrator) to demonstrate how different settings affect output.
 * 
 * VARIATIONS TESTED:
 * 1. Fiction + Expert + 10min + Rachel voice
 * 2. Documentary + Beginner + 5min + Documentary voice
 * 3. Tutorial + Intermediate + 15min + Tutorial voice
 * 4. Technical + Expert + 10min + Technical voice
 * 5. Podcast + Intermediate + 5min + Podcast host voice
 * 6. Fiction + Beginner + 5min + Fiction voice
 * 7. Documentary + Expert + 15min + Documentary voice
 * 8. Tutorial + Expert + 10min + Rachel voice
 * 9. Technical + Beginner + 5min + Technical voice
 * 10. Podcast + Expert + 15min + Podcast host voice
 */

import { db, stories, codeRepositories } from "../lib/db"
import { eq } from "drizzle-orm"

const REPOSITORY_ID = "8ffc7bb5-fd88-40a4-9fb6-f2b9172b1833"
const USER_ID = "replit-codetales-tester"

const VOICE_IDS = {
  rachel: "21m00Tcm4TlvDq8ikWAM",         // Default Rachel voice
  podcastGuest: "AZnzlk1XvdvUeBnXmlld",   // Podcast guest
  documentary: "ErXwobaYiN019PkySvjV",     // Documentary narrator
  fiction: "EXAVITQu4vr4xnSDxMaL",         // Fiction narrator
  tutorial: "pNInz6obpgDQGcFmaJgB",        // Tutorial narrator
  technical: "yoZ06aMxZJJ28mfd3POQ",       // Technical narrator
}

const STORY_CONFIGS = [
  {
    title: "Ralph Orchestrator: Epic Fantasy Saga",
    narrativeStyle: "fiction",
    expertiseLevel: "expert",
    targetDurationMinutes: 10,
    voiceId: VOICE_IDS.rachel,
  },
  {
    title: "Ralph Orchestrator: Beginner Documentary",
    narrativeStyle: "documentary",
    expertiseLevel: "beginner",
    targetDurationMinutes: 5,
    voiceId: VOICE_IDS.documentary,
  },
  {
    title: "Ralph Orchestrator: Complete Tutorial",
    narrativeStyle: "tutorial",
    expertiseLevel: "intermediate",
    targetDurationMinutes: 15,
    voiceId: VOICE_IDS.tutorial,
  },
  {
    title: "Ralph Orchestrator: Technical Deep Dive",
    narrativeStyle: "technical",
    expertiseLevel: "expert",
    targetDurationMinutes: 10,
    voiceId: VOICE_IDS.technical,
  },
  {
    title: "Ralph Orchestrator: Quick Podcast",
    narrativeStyle: "podcast",
    expertiseLevel: "intermediate",
    targetDurationMinutes: 5,
    voiceId: VOICE_IDS.rachel,
  },
  {
    title: "Ralph Orchestrator: Children's Fiction",
    narrativeStyle: "fiction",
    expertiseLevel: "beginner",
    targetDurationMinutes: 5,
    voiceId: VOICE_IDS.fiction,
  },
  {
    title: "Ralph Orchestrator: Expert Documentary",
    narrativeStyle: "documentary",
    expertiseLevel: "expert",
    targetDurationMinutes: 15,
    voiceId: VOICE_IDS.documentary,
  },
  {
    title: "Ralph Orchestrator: Expert Tutorial",
    narrativeStyle: "tutorial",
    expertiseLevel: "expert",
    targetDurationMinutes: 10,
    voiceId: VOICE_IDS.rachel,
  },
  {
    title: "Ralph Orchestrator: Beginner Technical",
    narrativeStyle: "technical",
    expertiseLevel: "beginner",
    targetDurationMinutes: 5,
    voiceId: VOICE_IDS.technical,
  },
  {
    title: "Ralph Orchestrator: Expert Podcast",
    narrativeStyle: "podcast",
    expertiseLevel: "expert",
    targetDurationMinutes: 15,
    voiceId: VOICE_IDS.rachel,
  },
]

async function createStories() {
  console.log("Creating 10 story variations...")
  console.log("Repository ID:", REPOSITORY_ID)
  console.log("User ID:", USER_ID)
  console.log("")

  const createdStories = []

  for (let i = 0; i < STORY_CONFIGS.length; i++) {
    const config = STORY_CONFIGS[i]
    console.log(`\n[${i + 1}/10] Creating: ${config.title}`)
    console.log(`  Style: ${config.narrativeStyle}`)
    console.log(`  Expertise: ${config.expertiseLevel}`)
    console.log(`  Duration: ${config.targetDurationMinutes} minutes`)
    console.log(`  Voice: ${config.voiceId}`)

    try {
      const [story] = await db
        .insert(stories)
        .values({
          userId: USER_ID,
          repositoryId: REPOSITORY_ID,
          title: config.title,
          narrativeStyle: config.narrativeStyle,
          expertiseLevel: config.expertiseLevel,
          targetDurationMinutes: config.targetDurationMinutes,
          voiceId: config.voiceId,
          status: "pending",
          progress: 0,
          progressMessage: "Queued for processing...",
          isPublic: true,
        })
        .returning()

      console.log(`  ✓ Created with ID: ${story.id}`)
      createdStories.push(story)
    } catch (error) {
      console.error(`  ✗ Error creating story:`, error)
    }
  }

  console.log("\n====== SUMMARY ======")
  console.log(`Created ${createdStories.length} stories\n`)

  for (const story of createdStories) {
    console.log(`ID: ${story.id}`)
    console.log(`  Title: ${story.title}`)
    console.log(`  Style: ${story.narrativeStyle}`)
    console.log(`  URL: /story/${story.id}`)
    console.log("")
  }

  return createdStories
}

async function triggerGeneration(storyId: string) {
  console.log(`\nTriggering generation for story: ${storyId}`)
  
  const response = await fetch(`${process.env.REPL_URL || 'http://localhost:5000'}/api/stories/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storyId }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`  ✗ Generation failed:`, error)
    return false
  }

  console.log(`  ✓ Generation started`)
  return true
}

async function main() {
  console.log("====== CODE TALES: 10 STORY VARIATIONS TEST ======\n")
  
  const stories = await createStories()
  
  console.log("\n====== TRIGGERING GENERATION ======")
  console.log("Note: Each story takes 2-5 minutes to generate\n")

  for (const story of stories) {
    await triggerGeneration(story.id)
    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  console.log("\n====== GENERATION TRIGGERED ======")
  console.log("Monitor progress at: /dashboard")
  console.log("\nPublic URLs (once complete):")
  for (const story of stories) {
    console.log(`  - /story/${story.id}`)
  }
}

main().catch(console.error)
