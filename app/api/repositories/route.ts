import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db, codeRepositories } from "@/lib/db"

interface CreateRepositoryRequest {
  repoUrl: string
  repoName: string
  repoOwner: string
  primaryLanguage?: string
  starsCount?: number
  description?: string
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CreateRepositoryRequest = await req.json()
    const { repoUrl, repoName, repoOwner, primaryLanguage, starsCount, description } = body

    const [repo] = await db
      .insert(codeRepositories)
      .values({
        userId: user.id,
        repoUrl,
        repoName,
        repoOwner,
        primaryLanguage,
        starsCount: starsCount ?? 0,
        description,
      })
      .returning()

    return NextResponse.json({ data: repo })
  } catch (error) {
    console.error("Error creating repository:", error)
    return NextResponse.json(
      { error: "Failed to create repository" },
      { status: 500 }
    )
  }
}
