import { db, stories } from "@/lib/db"
import { eq, and, isNotNull } from "drizzle-orm"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const failedStories = await db
      .select({
        id: stories.id,
        title: stories.title,
        scriptLength: stories.scriptText,
      })
      .from(stories)
      .where(
        and(
          eq(stories.status, "failed"),
          isNotNull(stories.scriptText)
        )
      )

    const storiesToRegenerate = failedStories.filter(s => s.scriptLength && s.scriptLength.length > 0)

    console.log("[BATCH] Found", storiesToRegenerate.length, "stories to regenerate")

    const results = []

    for (const story of storiesToRegenerate) {
      console.log("[BATCH] Triggering regeneration for:", story.title)
      
      try {
        const baseUrl = process.env.REPLIT_DEV_DOMAIN 
          ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
          : 'http://localhost:5000'
        
        const response = await fetch(`${baseUrl}/api/stories/regenerate-audio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storyId: story.id }),
        })

        const result = await response.json()
        results.push({
          id: story.id,
          title: story.title,
          success: response.ok,
          result: response.ok ? result : { error: result.error },
        })
      } catch (error) {
        results.push({
          id: story.id,
          title: story.title,
          success: false,
          result: { error: error instanceof Error ? error.message : "Unknown error" },
        })
      }
    }

    return Response.json({
      total: storiesToRegenerate.length,
      results,
    })
  } catch (error) {
    console.error("[BATCH] Error:", error)
    return Response.json(
      { error: "Batch regeneration failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const failedStories = await db
      .select({
        id: stories.id,
        title: stories.title,
        scriptText: stories.scriptText,
        errorMessage: stories.errorMessage,
      })
      .from(stories)
      .where(eq(stories.status, "failed"))

    const storiesToRegenerate = failedStories
      .filter(s => s.scriptText && s.scriptText.length > 0)
      .map(s => ({
        id: s.id,
        title: s.title,
        scriptLength: s.scriptText?.length || 0,
        errorMessage: s.errorMessage,
      }))

    return Response.json({
      count: storiesToRegenerate.length,
      stories: storiesToRegenerate,
    })
  } catch (error) {
    return Response.json(
      { error: "Failed to list stories", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
