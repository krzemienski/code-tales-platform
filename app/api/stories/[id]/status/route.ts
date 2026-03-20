import { NextResponse } from "next/server"
import { db, stories } from "@/lib/db"
import { eq } from "drizzle-orm"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Invalid story ID" }, { status: 400 })

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
