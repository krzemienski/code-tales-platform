import { db, stories } from "@/lib/db"
import { eq, sql } from "drizzle-orm"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) return Response.json({ error: "Invalid story ID" }, { status: 400 })

  try {
    await db
      .update(stories)
      .set({ playCount: sql`COALESCE(${stories.playCount}, 0) + 1` })
      .where(eq(stories.id, id))

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error incrementing play count:", error)
    return Response.json({ error: "Failed to increment play count" }, { status: 500 })
  }
}
