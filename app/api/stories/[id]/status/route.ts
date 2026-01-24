import { NextResponse } from "next/server"
import { db, stories } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [story] = await db
    .select({
      status: stories.status,
      progress: stories.progress,
      progressMessage: stories.progressMessage,
    })
    .from(stories)
    .where(eq(stories.id, id))

  if (!story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 })
  }

  return NextResponse.json(story)
}
