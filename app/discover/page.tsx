import { dbClient } from "@/lib/db/client"
import { db, stories, codeRepositories } from "@/lib/db"
import { eq, desc, and, ilike, or } from "drizzle-orm"
import Link from "next/link"
import { Headphones, Search, Flame, Clock, Code2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChronicleCard } from "@/components/chronicle-card"
import { Navbar } from "@/components/navbar"
import { ParallaxBackground } from "@/components/parallax-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>
}) {
  const params = await searchParams
  const searchQuery = params.q || ""
  const activeTab = params.tab || "trending"

  // Base query for stories with their repository information
  const getBaseQuery = () => 
    db.select({
      id: stories.id,
      title: stories.title,
      narrative_style: stories.narrativeStyle,
      actual_duration_seconds: stories.actualDurationSeconds,
      created_at: stories.createdAt,
      play_count: stories.playCount,
      audio_url: stories.audioUrl,
      audio_chunks: stories.audioChunks,
      code_repositories: {
        repo_name: codeRepositories.repoName,
        repo_owner: codeRepositories.repoOwner,
        primary_language: codeRepositories.primaryLanguage,
        stars_count: codeRepositories.starsCount,
        description: codeRepositories.description,
      }
    })
    .from(stories)
    .leftJoin(codeRepositories, eq(stories.repositoryId, codeRepositories.id))
    .where(
      and(
        eq(stories.status, "completed"),
        eq(stories.isPublic, true),
        searchQuery ? or(
          ilike(stories.title, `%${searchQuery}%`),
          ilike(codeRepositories.repoName, `%${searchQuery}%`),
          ilike(codeRepositories.description, `%${searchQuery}%`)
        ) : undefined
      )
    );

  // Fetch trending stories (by play count)
  const trendingStories = await getBaseQuery()
    .orderBy(desc(stories.playCount))
    .limit(50);

  // Fetch recent stories
  const recentStories = await getBaseQuery()
    .orderBy(desc(stories.createdAt))
    .limit(50);


  // Group by language for filtering
  const byLanguage = (trendingStories || []).reduce(
    (acc: Record<string, any[]>, story: any) => {
      const lang = story.code_repositories?.primary_language || "Other"
      if (!acc[lang]) acc[lang] = []
      acc[lang].push(story)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const languages = Object.keys(byLanguage).sort()
  const totalStories = (trendingStories?.length || 0) + (recentStories?.length || 0)

  return (
    <div className="min-h-screen bg-background relative">
      <ParallaxBackground />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-32">
        {" "}
        {/* Added pb-32 for floating player space */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Discover Stories</h1>
          <p className="text-muted-foreground">Listen to code stories created by the community</p>
        </div>
        {/* Search Form */}
        <form action="/discover" method="GET" className="relative max-w-lg mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search stories by title, repo, or topic..."
            className="w-full rounded-lg border border-border bg-input py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <Link
              href="/discover"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Link>
          )}
        </form>
        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {totalStories > 0 ? (
                <>
                  Found <span className="font-medium text-foreground">{totalStories}</span> stories matching "
                  <span className="font-medium text-foreground">{searchQuery}</span>"
                </>
              ) : (
                <>
                  No stories found for "<span className="font-medium text-foreground">{searchQuery}</span>"
                </>
              )}
            </span>
          </div>
        )}
        {/* Tabs for Trending/Recent/By Language */}
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="mb-8 bg-secondary/50">
            <TabsTrigger
              value="trending"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Flame className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Clock className="w-4 h-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger
              value="languages"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Code2 className="w-4 h-4" />
              By Language
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            {trendingStories && trendingStories.length > 0 ? (
              <div className="space-y-4">
                {trendingStories.map((story: any) => (
                  <ChronicleCard key={story.id} story={story} variant="list" />
                ))}
              </div>
            ) : (
              <EmptyState searchQuery={searchQuery} />
            )}
          </TabsContent>

          <TabsContent value="recent">
            {recentStories && recentStories.length > 0 ? (
              <div className="space-y-4">
                {recentStories.map((story: any) => (
                  <ChronicleCard key={story.id} story={story} variant="list" />
                ))}
              </div>
            ) : (
              <EmptyState searchQuery={searchQuery} />
            )}
          </TabsContent>

          <TabsContent value="languages">
            {languages.length > 0 ? (
              <div className="space-y-12">
                {languages.map((language) => (
                  <section key={language}>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {language}
                      <span className="text-sm font-normal text-muted-foreground">({byLanguage[language].length})</span>
                    </h2>
                    <div className="space-y-4">
                      {byLanguage[language].map((story: any) => (
                        <ChronicleCard key={story.id} story={story} variant="list" />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <EmptyState searchQuery={searchQuery} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function EmptyState({ searchQuery }: { searchQuery?: string }) {
  return (
    <div className="text-center py-16">
      <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2 text-foreground">
        {searchQuery ? "No matching stories" : "No stories yet"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery ? "Try a different search term" : "Be the first to create a code story!"}
      </p>
      <Button asChild className="bg-primary hover:bg-primary/90">
        <Link href={searchQuery ? "/discover" : "/dashboard/new"}>{searchQuery ? "Clear Search" : "Create Story"}</Link>
      </Button>
    </div>
  )
}
