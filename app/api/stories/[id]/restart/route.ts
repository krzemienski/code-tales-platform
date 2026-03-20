import { db, stories, processingLogs } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { getAuthenticatedUser } from "@/lib/auth"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: storyId } = await params
  if (!UUID_RE.test(storyId)) return Response.json({ error: "Invalid story ID" }, { status: 400 })

  const url = new URL(req.url)
  const baseUrl = url.origin

  const user = await getAuthenticatedUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [story] = await db
    .select({ id: stories.id, userId: stories.userId })
    .from(stories)
    .where(and(eq(stories.id, storyId), eq(stories.userId, user.id)))

  if (!story) {
    return Response.json({ error: "Story not found" }, { status: 404 })
  }

  await db.delete(processingLogs).where(eq(processingLogs.storyId, storyId))

  await db
    .update(stories)
    .set({
      status: "pending",
      progress: 0,
      progressMessage: "Restarting generation...",
      errorMessage: null,
      processingStartedAt: null,
      processingCompletedAt: null,
    })
    .where(eq(stories.id, storyId))

  fetch(`${baseUrl}/api/stories/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storyId }),
  }).catch((err) => console.error("[v0] Failed to trigger generation:", err))

  return Response.json({ success: true, message: "Generation restarted" })
}
