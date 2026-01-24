import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db, stories, codeRepositories, storyIntents } from "@/lib/db"
import { eq } from "drizzle-orm"

interface CreateStoryWithRepoRequest {
  repoInfo: {
    url: string
    owner: string
    name: string
    description: string
    language: string
    stars: number
  }
  narrativeStyle: string
  voiceId: string
  targetDurationMinutes: number
  expertiseLevel: string
  intent?: string
}

interface CreateStoryWithRepoIdRequest {
  repositoryId: string
  title: string
  narrativeStyle: string
  voiceId: string
  targetDurationMinutes: number
  expertiseLevel: string
  isPublic?: boolean
  generationMode?: string
  generationConfig?: Record<string, unknown>
}

type CreateStoryRequest = CreateStoryWithRepoRequest | CreateStoryWithRepoIdRequest

function isCreateWithRepoId(body: CreateStoryRequest): body is CreateStoryWithRepoIdRequest {
  return 'repositoryId' in body
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CreateStoryRequest = await req.json()

    if (isCreateWithRepoId(body)) {
      const { repositoryId, title, narrativeStyle, voiceId, targetDurationMinutes, expertiseLevel, isPublic, generationMode, generationConfig } = body

      const [existingRepo] = await db.select().from(codeRepositories).where(eq(codeRepositories.id, repositoryId))
      if (!existingRepo) {
        return NextResponse.json({ error: "Repository not found" }, { status: 404 })
      }

      const [story] = await db
        .insert(stories)
        .values({
          userId: user.id,
          repositoryId,
          title,
          narrativeStyle,
          voiceId,
          targetDurationMinutes,
          expertiseLevel,
          status: "pending",
          progress: 0,
          progressMessage: "Queued for processing...",
          isPublic: isPublic ?? true,
          generationMode,
          modelConfig: generationConfig,
        })
        .returning()

      return NextResponse.json({ data: story })
    }

    const { repoInfo, narrativeStyle, voiceId, targetDurationMinutes, expertiseLevel, intent } = body

    const [repo] = await db
      .insert(codeRepositories)
      .values({
        userId: user.id,
        repoUrl: repoInfo.url,
        repoName: repoInfo.name,
        repoOwner: repoInfo.owner,
        primaryLanguage: repoInfo.language,
        starsCount: repoInfo.stars,
        description: repoInfo.description,
      })
      .returning()

    let intentId = null
    if (intent) {
      const [intentData] = await db
        .insert(storyIntents)
        .values({
          userId: user.id,
          repositoryId: repo.id,
          intentCategory: "custom",
          userDescription: intent,
          expertiseLevel,
        })
        .returning()
      intentId = intentData.id
    }

    const title = intent
      ? `${repoInfo.name}: ${intent.slice(0, 50)}...`
      : `${repoInfo.name}: Overview`

    const [story] = await db
      .insert(stories)
      .values({
        userId: user.id,
        repositoryId: repo.id,
        intentId,
        title,
        narrativeStyle,
        voiceId,
        targetDurationMinutes,
        expertiseLevel,
        status: "pending",
        progress: 0,
        progressMessage: "Queued for processing...",
      })
      .returning()

    return NextResponse.json({ story, repo })
  } catch (error) {
    console.error("Error creating story:", error)
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    )
  }
}
