import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { stories, stageMetrics, processingLogs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

interface CompareGenerationRequest {
  repositoryUrl: string
  repositoryOwner: string
  repositoryName: string
  repositoryAnalysis: string
  userId: string
  title: string
  narrativeStyle: string
  expertiseLevel?: string
  targetDurationMinutes?: number
  voiceId?: string
  studioConfig?: {
    format: "podcast" | "audiobook"
    hostVoiceId: string
    guestVoiceId?: string
    duration: "short" | "default" | "long"
    qualityPreset?: "standard" | "high" | "ultra"
    instructionsPrompt?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CompareGenerationRequest = await request.json()
    const {
      repositoryUrl,
      repositoryOwner,
      repositoryName,
      repositoryAnalysis,
      userId,
      title,
      narrativeStyle,
      expertiseLevel = "intermediate",
      targetDurationMinutes = 5,
      voiceId = "21m00Tcm4TlvDq8ikWAM",
      studioConfig,
    } = body

    if (!repositoryUrl || !userId || !title) {
      return NextResponse.json(
        { error: "Missing required fields: repositoryUrl, userId, title" },
        { status: 400 }
      )
    }

    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : "http://localhost:5000"

    const [hybridStory] = await db.insert(stories).values({
      userId,
      title: `${title} (Hybrid)`,
      narrativeStyle,
      voiceId,
      expertiseLevel,
      targetDurationMinutes,
      status: "pending",
      generationMode: "hybrid",
      isPublic: false,
    }).returning()

    const [studioStory] = await db.insert(stories).values({
      userId,
      title: `${title} (Studio)`,
      narrativeStyle,
      voiceId: studioConfig?.hostVoiceId || voiceId,
      expertiseLevel,
      targetDurationMinutes,
      status: "pending",
      generationMode: `studio_${studioConfig?.format || "podcast"}`,
      isPublic: false,
    }).returning()

    await db.insert(processingLogs).values([
      {
        storyId: hybridStory.id,
        agentName: "CompareGenerator",
        action: "compare_started",
        details: { mode: "hybrid", pairId: studioStory.id },
        level: "info",
      },
      {
        storyId: studioStory.id,
        agentName: "CompareGenerator",
        action: "compare_started",
        details: { mode: "studio", pairId: hybridStory.id },
        level: "info",
      },
    ])

    const hybridPromise = fetch(`${baseUrl}/api/stories/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storyId: hybridStory.id,
        repositoryUrl,
        repositoryOwner,
        repositoryName,
        repositoryAnalysis,
        narrativeStyle,
        expertiseLevel,
        targetDurationMinutes,
        voiceId,
        modelId: "anthropic/claude-sonnet-4",
      }),
    }).catch((error) => {
      console.error("[Compare] Hybrid generation failed:", error)
      return null
    })

    const studioPromise = fetch(`${baseUrl}/api/stories/generate-studio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storyId: studioStory.id,
        repositoryUrl,
        repositoryAnalysis,
        format: studioConfig?.format || "podcast",
        config: {
          hostVoiceId: studioConfig?.hostVoiceId || voiceId,
          guestVoiceId: studioConfig?.guestVoiceId,
          duration: studioConfig?.duration || "default",
          qualityPreset: studioConfig?.qualityPreset || "high",
          instructionsPrompt: studioConfig?.instructionsPrompt,
        },
      }),
    }).catch((error) => {
      console.error("[Compare] Studio generation failed:", error)
      return null
    })

    Promise.all([hybridPromise, studioPromise]).then(async ([hybridResult, studioResult]) => {
      await db.insert(processingLogs).values([
        {
          storyId: hybridStory.id,
          agentName: "CompareGenerator",
          action: "generation_triggered",
          details: { success: !!hybridResult },
          level: hybridResult ? "info" : "error",
        },
        {
          storyId: studioStory.id,
          agentName: "CompareGenerator",
          action: "generation_triggered",
          details: { success: !!studioResult },
          level: studioResult ? "info" : "error",
        },
      ])
    })

    return NextResponse.json({
      success: true,
      comparison: {
        hybridStoryId: hybridStory.id,
        studioStoryId: studioStory.id,
        status: "generating",
      },
      streamUrls: {
        hybrid: `/api/stories/${hybridStory.id}/stream`,
        studio: `/api/stories/${studioStory.id}/stream`,
      },
      statusUrls: {
        hybrid: `/api/stories/${hybridStory.id}/status`,
        studio: `/api/stories/${studioStory.id}/status`,
      },
    })
  } catch (error) {
    console.error("[generate-compare] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
