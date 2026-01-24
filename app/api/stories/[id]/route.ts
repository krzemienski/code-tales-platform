import { db, stories, codeRepositories, storyChapters } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [story] = await db
    .select()
    .from(stories)
    .where(eq(stories.id, id))

  if (!story) {
    return Response.json({ error: "Story not found" }, { status: 404 })
  }

  const [repository] = story.repositoryId
    ? await db.select().from(codeRepositories).where(eq(codeRepositories.id, story.repositoryId))
    : [null]

  const chapters = await db
    .select()
    .from(storyChapters)
    .where(eq(storyChapters.storyId, id))

  const result = {
    ...story,
    code_repositories: repository,
    story_chapters: chapters,
  }

  return Response.json(result)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const updates = await req.json()

  const [updated] = await db
    .update(stories)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(stories.id, id))
    .returning()

  if (!updated) {
    return Response.json({ error: "Story not found" }, { status: 404 })
  }

  return Response.json(updated)
}
