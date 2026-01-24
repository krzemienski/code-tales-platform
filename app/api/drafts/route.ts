import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db, storyDrafts } from "@/lib/db"
import { eq, desc } from "drizzle-orm"

interface CreateDraftRequest {
  repositoryUrl: string
  repositoryName?: string
  repositoryOwner?: string
  repositoryDescription?: string
  repositoryLanguage?: string
  repositoryStars?: number
  styleConfig?: {
    narrativeStyle?: string
    secondaryStyle?: string
    contentFormat?: string
    pacing?: string
    toneIntensity?: string
    duration?: string
    expertise?: string
    intent?: string
  }
  modelConfig?: Record<string, unknown>
  voiceConfig?: {
    voiceId?: string
  }
  scheduledAt?: string
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CreateDraftRequest = await req.json()

    const [draft] = await db
      .insert(storyDrafts)
      .values({
        userId: user.id,
        repositoryUrl: body.repositoryUrl,
        repositoryName: body.repositoryName,
        repositoryOwner: body.repositoryOwner,
        repositoryDescription: body.repositoryDescription,
        repositoryLanguage: body.repositoryLanguage,
        repositoryStars: body.repositoryStars,
        styleConfig: body.styleConfig || {},
        modelConfig: body.modelConfig || {},
        voiceConfig: body.voiceConfig || {},
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      })
      .returning()

    return NextResponse.json({ draft })
  } catch (error) {
    console.error("Error creating draft:", error)
    return NextResponse.json(
      { error: "Failed to create draft" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const drafts = await db
      .select()
      .from(storyDrafts)
      .where(eq(storyDrafts.userId, user.id))
      .orderBy(desc(storyDrafts.updatedAt))

    return NextResponse.json({ drafts })
  } catch (error) {
    console.error("Error fetching drafts:", error)
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    )
  }
}
