import { db, stories, codeRepositories, users } from "../lib/db"
import { eq, and } from "drizzle-orm"

const SYSTEM_USER_ID = "replit-codetales-tester"

interface RepoConfig {
  owner: string
  name: string
  narrativeStyle: string
  title: string
  targetDuration: number
  expertiseLevel: string
}

const SAMPLE_REPOS: RepoConfig[] = [
  {
    owner: "fastapi",
    name: "fastapi",
    narrativeStyle: "documentary",
    title: "FastAPI: The Modern Python Web Framework",
    targetDuration: 12,
    expertiseLevel: "intermediate",
  },
  {
    owner: "pallets",
    name: "flask",
    narrativeStyle: "tutorial",
    title: "Flask: A Microframework Journey",
    targetDuration: 10,
    expertiseLevel: "beginner",
  },
  {
    owner: "langchain-ai",
    name: "langchain",
    narrativeStyle: "fiction",
    title: "The LangChain Chronicles: AI Agents Unleashed",
    targetDuration: 15,
    expertiseLevel: "intermediate",
  },
  {
    owner: "supabase",
    name: "supabase",
    narrativeStyle: "documentary",
    title: "Supabase: Building the Open Source Firebase",
    targetDuration: 14,
    expertiseLevel: "intermediate",
  },
  {
    owner: "shadcn-ui",
    name: "ui",
    narrativeStyle: "tutorial",
    title: "shadcn/ui: Components That Just Work",
    targetDuration: 8,
    expertiseLevel: "beginner",
  },
  {
    owner: "prisma",
    name: "prisma",
    narrativeStyle: "technical",
    title: "Prisma ORM: Next-Generation Database Access",
    targetDuration: 12,
    expertiseLevel: "advanced",
  },
  {
    owner: "trpc",
    name: "trpc",
    narrativeStyle: "fiction",
    title: "tRPC: The Type-Safe API Revolution",
    targetDuration: 10,
    expertiseLevel: "intermediate",
  },
  {
    owner: "drizzle-team",
    name: "drizzle-orm",
    narrativeStyle: "documentary",
    title: "Drizzle ORM: SQL That Feels Like TypeScript",
    targetDuration: 11,
    expertiseLevel: "intermediate",
  },
]

async function createRepoIfNeeded(config: RepoConfig) {
  const repoUrl = `https://github.com/${config.owner}/${config.name}`
  
  const existing = await db
    .select()
    .from(codeRepositories)
    .where(
      and(
        eq(codeRepositories.repoOwner, config.owner),
        eq(codeRepositories.repoName, config.name)
      )
    )
  
  if (existing.length > 0) {
    console.log(`Repository ${config.owner}/${config.name} already exists`)
    return existing[0]
  }
  
  const [repo] = await db
    .insert(codeRepositories)
    .values({
      userId: SYSTEM_USER_ID,
      repoUrl,
      repoOwner: config.owner,
      repoName: config.name,
      primaryLanguage: "TypeScript",
      description: `${config.name} repository`,
      starsCount: 0,
    })
    .returning()
  
  console.log(`Created repository: ${config.owner}/${config.name}`)
  return repo
}

async function createStoryIfNeeded(config: RepoConfig, repoId: string) {
  const existing = await db
    .select()
    .from(stories)
    .where(eq(stories.title, config.title))
  
  if (existing.length > 0) {
    console.log(`Story "${config.title}" already exists`)
    return existing[0]
  }
  
  const [story] = await db
    .insert(stories)
    .values({
      userId: SYSTEM_USER_ID,
      repositoryId: repoId,
      title: config.title,
      narrativeStyle: config.narrativeStyle,
      voiceId: "onwK4e9ZLuTAKqWW03F9",
      targetDurationMinutes: config.targetDuration,
      expertiseLevel: config.expertiseLevel,
      status: "pending",
      isPublic: true,
    })
    .returning()
  
  console.log(`Created story: ${config.title} (ID: ${story.id})`)
  return story
}

async function main() {
  console.log("Starting sample story generation setup...")
  console.log(`Processing ${SAMPLE_REPOS.length} repositories...\n`)
  
  const storiesToGenerate: { id: string; title: string }[] = []
  
  for (const config of SAMPLE_REPOS) {
    try {
      const repo = await createRepoIfNeeded(config)
      const story = await createStoryIfNeeded(config, repo.id)
      
      if (story.status === "pending") {
        storiesToGenerate.push({ id: story.id, title: story.title })
      }
    } catch (error) {
      console.error(`Error processing ${config.owner}/${config.name}:`, error)
    }
  }
  
  console.log("\n=== Stories ready for generation ===")
  for (const story of storiesToGenerate) {
    console.log(`Story ID: ${story.id}`)
    console.log(`Title: ${story.title}`)
    console.log(`curl -X POST http://localhost:5000/api/stories/generate -H "Content-Type: application/json" -d '{"storyId":"${story.id}"}'`)
    console.log("")
  }
  
  console.log(`\nTotal: ${storiesToGenerate.length} stories to generate`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
