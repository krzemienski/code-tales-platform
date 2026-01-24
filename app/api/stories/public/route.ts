import { db, stories, codeRepositories } from "@/lib/db"
import { eq, and, desc } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sortBy = searchParams.get("sort") || "trending"
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50)

  const orderColumn = sortBy === "trending" ? desc(stories.playCount) : desc(stories.createdAt)

  const result = await db
    .select({
      id: stories.id,
      title: stories.title,
      narrative_style: stories.narrativeStyle,
      actual_duration_seconds: stories.actualDurationSeconds,
      play_count: stories.playCount,
      created_at: stories.createdAt,
      repo_owner: codeRepositories.repoOwner,
      repo_name: codeRepositories.repoName,
      primary_language: codeRepositories.primaryLanguage,
    })
    .from(stories)
    .leftJoin(codeRepositories, eq(stories.repositoryId, codeRepositories.id))
    .where(and(eq(stories.status, "completed"), eq(stories.isPublic, true)))
    .orderBy(orderColumn)
    .limit(limit)

  const formattedStories = result.map((r) => ({
    id: r.id,
    title: r.title,
    narrative_style: r.narrative_style,
    actual_duration_seconds: r.actual_duration_seconds,
    play_count: r.play_count,
    created_at: r.created_at,
    code_repositories: r.repo_owner
      ? {
          repo_owner: r.repo_owner,
          repo_name: r.repo_name,
          primary_language: r.primary_language,
        }
      : null,
  }))

  return Response.json(formattedStories)
}
