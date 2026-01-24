import { notFound } from "next/navigation"
import Link from "next/link"
import { db, stories, codeRepositories, storyChapters } from "@/lib/db"
import { eq, sql } from "drizzle-orm"
import { StoryPlayer } from "@/components/story-player"
import { Button } from "@/components/ui/button"
import { Github, Share2, Clock, Headphones, Play } from "lucide-react"
import { Navbar } from "@/components/navbar"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicStoryPage({ params }: PageProps) {
  const { id } = await params

  const storyResult = await db
    .select()
    .from(stories)
    .leftJoin(codeRepositories, eq(stories.repositoryId, codeRepositories.id))
    .where(eq(stories.id, id))

  if (!storyResult || storyResult.length === 0) {
    notFound()
  }

  const story = storyResult[0].stories
  const repo = storyResult[0].code_repositories

  const chaptersResult = await db
    .select()
    .from(storyChapters)
    .where(eq(storyChapters.storyId, id))
    .orderBy(storyChapters.chapterNumber)

  await db
    .update(stories)
    .set({ playCount: sql`COALESCE(${stories.playCount}, 0) + 1` })
    .where(eq(stories.id, id))

  const repoName = repo ? `${repo.repoOwner}/${repo.repoName}` : story.title
  const duration = story.actualDurationSeconds
    ? `${Math.floor(story.actualDurationSeconds / 60)} min`
    : `~${story.targetDurationMinutes} min`

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Github className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{repoName}</h1>
                  <p className="text-sm text-zinc-400">{story.title}</p>
                </div>
              </div>
              {repo?.description && <p className="text-zinc-500 text-sm mt-3 max-w-xl">{repo.description}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-500">
                {repo?.primaryLanguage && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {repo.primaryLanguage}
                  </span>
                )}
                {(repo?.starsCount ?? 0) > 0 && <span>{repo?.starsCount?.toLocaleString()} stars</span>}
                <span className="capitalize px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  {story.narrativeStyle}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {duration}
                </span>
                {(story.playCount || 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <Headphones className="h-3.5 w-3.5" />
                    {story.playCount?.toLocaleString()} plays
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {repo && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-zinc-700 hover:bg-zinc-800"
                  asChild
                >
                  <a
                    href={`https://github.com/${repo.repoOwner}/${repo.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View Repo
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {story.status === "completed" ? (
          <StoryPlayer
            storyId={story.id}
            title={story.title}
            subtitle={story.narrativeStyle}
            audioUrl={story.audioUrl}
            audioChunks={(story.audioChunks as string[]) || []}
            chapters={chaptersResult || []}
            scriptText={story.scriptText}
            repositoryName={repoName}
          />
        ) : story.status === "synthesizing" ||
          story.status === "analyzing" ||
          story.status === "pending" ||
          story.status === "generating" ? (
          <div className="text-center py-16 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full animate-soundwave"
                  style={{
                    height: "24px",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-zinc-400 mb-2">Story is being generated...</p>
            <p className="text-zinc-600 text-sm">{story.progressMessage || "Processing"}</p>
            <Button variant="outline" className="mt-6 bg-transparent border-zinc-700" asChild>
              <Link href={`/dashboard/story/${story.id}`}>View Progress</Link>
            </Button>
          </div>
        ) : story.status === "failed" ? (
          <div className="text-center py-16 rounded-xl bg-zinc-900/50 border border-red-900/50">
            <p className="text-red-400 mb-2">Story generation failed</p>
            <p className="text-zinc-600 text-sm">{story.errorMessage || "An error occurred"}</p>
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <Play className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">This story is not available.</p>
          </div>
        )}

        {story.status === "completed" && story.scriptText && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">Transcript</h2>
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 max-h-96 overflow-y-auto">
              <p className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed">{story.scriptText}</p>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-4">More Stories</h2>
          <p className="text-zinc-500 text-sm">
            <Link href="/discover" className="text-emerald-500 hover:underline">
              Discover more stories
            </Link>{" "}
            from the community.
          </p>
        </div>
      </main>
    </div>
  )
}
