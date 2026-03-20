import { db, stories, codeRepositories } from "@/lib/db"
import { eq } from "drizzle-orm"
import { analyzeRepository, summarizeRepoStructure } from "@/lib/agents/github"
import type { AgentSkill, AgentSkillMetadata, AgentSkillLogger, PipelineContext, ContentSource, ContentSourceAnalysis } from "../types"

export class GitHubContentSource implements ContentSource {
  name = "github"

  constructor(
    private owner: string,
    private repoName: string,
  ) {}

  async analyze(): Promise<ContentSourceAnalysis> {
    return analyzeRepository(this.owner, this.repoName)
  }

  summarize(analysis: ContentSourceAnalysis): string {
    return summarizeRepoStructure(analysis)
  }
}

export class AnalyzerSkill implements AgentSkill {
  metadata: AgentSkillMetadata = {
    name: "Analyzer",
    description: "Analyzes content sources (e.g. GitHub repositories) to extract structure, metadata, and key information",
    acceptedInputs: ["repo.repoOwner", "repo.repoName"],
    producedOutputs: ["repoAnalysis", "repoSummary"],
  }

  private contentSource: ContentSource | null = null

  configure(config: Record<string, any>): void {
    if (config.contentSource) {
      this.contentSource = config.contentSource
    }
  }

  async execute(
    context: PipelineContext,
    logger: AgentSkillLogger,
    updateProgress: (progress: number, message: string, statusOverride?: string) => Promise<void>,
  ): Promise<PipelineContext> {
    const source = this.contentSource || new GitHubContentSource(context.repo.repoOwner, context.repo.repoName)

    await updateProgress(5, "Connecting to GitHub...", "analyzing")

    await logger.log("Connecting to GitHub API", {
      repo: `${context.repo.repoOwner}/${context.repo.repoName}`,
    })

    await updateProgress(10, "Fetching repository metadata...")

    await logger.log("Fetching repository metadata", {})

    const analysis = await source.analyze()

    await logger.log(
      "Repository metadata retrieved",
      {
        stars: analysis.metadata?.stargazers_count,
        forks: analysis.metadata?.forks_count,
        language: analysis.metadata?.language,
        architecture: analysis.architecturePattern,
        coreFiles: Object.keys(analysis.coreFileContents).length,
        dependencies: analysis.dependencies.length,
        hasEvolution: !!analysis.evolution,
      },
      "success",
    )

    await updateProgress(15, "Scanning directory structure...")
    await logger.log("Scanning directory structure", {
      totalFiles: analysis.structure.length,
    })

    await logger.log(
      "Identified key directories",
      {
        directories: analysis.keyDirectories.slice(0, 5),
      },
      "success",
    )

    const summary = source.summarize(analysis)
    console.log("[v0] Repo analysis complete, summary length:", summary.length)

    await logger.log(
      "Analysis complete",
      {
        filesAnalyzed: analysis.structure.length,
        keyDirectories: analysis.keyDirectories.length,
        architecturePattern: analysis.architecturePattern,
        dependencyCount: analysis.dependencies.length,
        summaryLength: summary.length,
      },
      "success",
    )

    await db
      .update(codeRepositories)
      .set({
        analysisCache: analysis,
        analysisCachedAt: new Date(),
      })
      .where(eq(codeRepositories.id, context.repo.id))

    return {
      ...context,
      repoAnalysis: analysis,
      repoSummary: summary,
    }
  }
}

