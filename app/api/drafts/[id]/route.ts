import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db, storyDrafts } from "@/lib/db"
import { eq, and } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const [draft] = await db
      .select()
      .from(storyDrafts)
      .where(and(eq(storyDrafts.id, id), eq(storyDrafts.userId, user.id)))

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    return NextResponse.json({ draft })
  } catch (error) {
    console.error("Error fetching draft:", error)
    return NextResponse.json(
      { error: "Failed to fetch draft" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const [draft] = await db
      .select()
      .from(storyDrafts)
      .where(and(eq(storyDrafts.id, id), eq(storyDrafts.userId, user.id)))

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    await db
      .delete(storyDrafts)
      .where(and(eq(storyDrafts.id, id), eq(storyDrafts.userId, user.id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting draft:", error)
    return NextResponse.json(
      { error: "Failed to delete draft" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const [existingDraft] = await db
      .select()
      .from(storyDrafts)
      .where(and(eq(storyDrafts.id, id), eq(storyDrafts.userId, user.id)))

    if (!existingDraft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    const [draft] = await db
      .update(storyDrafts)
      .set({
        ...body,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : existingDraft.scheduledAt,
        updatedAt: new Date(),
      })
      .where(and(eq(storyDrafts.id, id), eq(storyDrafts.userId, user.id)))
      .returning()

    return NextResponse.json({ draft })
  } catch (error) {
    console.error("Error updating draft:", error)
    return NextResponse.json(
      { error: "Failed to update draft" },
      { status: 500 }
    )
  }
}
