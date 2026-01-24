import { db, stories } from "@/lib/db"
import { eq, sql } from "drizzle-orm"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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
