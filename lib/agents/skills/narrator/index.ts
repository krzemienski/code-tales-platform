import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { db, stories } from "@/lib/db"
import { eq } from "drizzle-orm"
import { getStoryPrompt, getChapterPrompt } from "@/lib/agents/prompts"
import type { RepoAnalysis } from "@/lib/agents/github"
import type { AgentSkill, AgentSkillMetadata, AgentSkillLogger, PipelineContext } from "../types"

function getStyleSpecificInstruction(style: string): string {
  switch (style) {
    case "fiction":
      return "Create a complete three-act fictional world with Guardian Functions, Rebel Bugs, Architect Classes, Messengers, and Oracles as characters. Include dialogue, inner monologue, and genuine dramatic tension."
    case "documentary":
      return "Follow the four-act documentary structure: Origin Story, Architecture Revealed, Impact Analysis, Legacy & Future. Use journalistic precision with specific metrics and data-driven transitions."
    case "podcast":
      return "Write as a two-voice conversation between ALEX (host) and JORDAN (expert) with ALEX: and JORDAN: dialogue tags. Include natural speech patterns, interruptions, reactions like [laughs], and genuine back-and-forth."
    case "technical":
      return "Conduct an exhaustive architectural review covering topology, data flow, design patterns, performance profile, security surface, and code quality. Reference specific files and functions by name."
    case "tutorial":
      return "Build a progressive five-module learning journey: Orientation, Foundations, Building Blocks, Integration, Mastery. Include learning objectives, mental checkpoints, try-this prompts, and recap sections."
    default:
      return "Fully commit to this narrative style throughout the entire script."
  }
}

export class NarratorSkill implements AgentSkill {
  metadata: AgentSkillMetadata = {
    name: "Narrator",
    description: "Generates narrative scripts from repository analysis using style-specific prompts",
    acceptedInputs: ["repoAnalysis", "repoSummary", "selectedModelId", "modelConfigData", "promptOptimizations"],
    producedOutputs: ["script", "chapters", "actualWords", "scriptWordCount"],
  }

  configure(_config: Record<string, any>): void {}

  async execute(
    context: PipelineContext,
    logger: AgentSkillLogger,
    updateProgress: (progress: number, message: string, statusOverride?: string) => Promise<void>,
  ): Promise<PipelineContext> {
    const analysis = context.repoAnalysis as RepoAnalysis
    const repoSummary = context.repoSummary
    if (!analysis || !repoSummary) {
      throw new Error("NarratorSkill requires repoAnalysis and repoSummary in context")
    }

    const targetMinutes = context.story.targetDurationMinutes
    const targetWords = targetMinutes * 150
    const modelConfigData = context.modelConfigData
    const promptOptimizations = context.promptOptimizations

    await updateProgress(50, `Generating narrative with ${context.modelDisplayName}...`)

    await logger.log("Generating narrative outline", {
      style: context.story.narrativeStyle,
      targetMinutes,
      model: context.modelDisplayName,
    })

    const baseSystemPrompt = getStoryPrompt(
      context.story.narrativeStyle,
      context.story.expertiseLevel,
      targetMinutes,
    )
    const systemPrompt = [
      promptOptimizations.systemPromptPrefix,
      baseSystemPrompt,
      promptOptimizations.specialInstructions,
      promptOptimizations.systemPromptSuffix,
    ]
      .filter(Boolean)
      .join("\n\n")

    console.log(
      "[v0] Generating script with",
      context.modelDisplayName,
      ", target words:",
      targetWords,
      "maxTokens:",
      modelConfigData.maxTokens,
    )

    await logger.log(`Writing script with ${context.modelDisplayName}`, {
      model: context.selectedModelId,
      targetWords,
      maxTokens: modelConfigData.maxTokens,
      temperature: modelConfigData.temperature,
      style: context.story.narrativeStyle,
    })

    let script: string
    const modelName = context.selectedModelId.includes("/")
      ? context.selectedModelId.split("/")[1]
      : context.selectedModelId
    console.log("[v0] Calling AI API with model:", modelName)

    const result = await generateText({
      model: anthropic(modelName),
      system: systemPrompt,
      prompt: `Create an audio narrative script for the repository ${context.repo.repoOwner}/${context.repo.repoName}.

NARRATIVE STYLE: ${context.story.narrativeStyle.toUpperCase()}
TARGET DURATION: ${targetMinutes} minutes (~${targetWords} words)
USER'S INTENT: ${context.story.title}
${context.intentContext}

REPOSITORY ANALYSIS:
${repoSummary}

KEY DIRECTORIES TO COVER:
${analysis.keyDirectories.slice(0, 15).join("\n")}

CRITICAL INSTRUCTIONS:
1. You MUST generate approximately ${targetWords} words - this is a ${targetMinutes}-minute audio experience
2. Style is "${context.story.narrativeStyle}" - fully commit to this style's structural framework throughout
3. ${getStyleSpecificInstruction(context.story.narrativeStyle)}
4. Cover ALL major aspects of the codebase - do not rush or summarize
5. Include natural pauses (...) for dramatic effect and breathing
6. Follow the complete structural framework defined in your system prompt — do not skip sections or acts
7. Do NOT include any markdown headers or formatting - just natural prose with paragraph breaks
8. Make it engaging enough that someone would want to listen for the full ${targetMinutes} minutes

BEGIN YOUR ${targetMinutes}-MINUTE ${context.story.narrativeStyle.toUpperCase()} NARRATIVE NOW:`,
      maxOutputTokens: modelConfigData.maxTokens,
      temperature: modelConfigData.temperature,
    })
    script = result.text
    const actualWords = script.split(/\s+/).length
    console.log("[v0] AI API call successful, generated", actualWords, "words")

    if (result.usage) {
      console.log("[v0] Token usage:", result.usage)
      await logger.log(
        "Generation complete",
        {
          model: context.selectedModelId,
          inputTokens: result.usage.inputTokens,
          outputTokens: result.usage.outputTokens,
          totalTokens: result.usage.totalTokens,
        },
        "success",
      )
    }

    console.log("[v0] Script generated, actual words:", actualWords)

    await logger.log(
      "Script draft complete",
      {
        words: actualWords,
        estimatedMinutes: Math.round(actualWords / 150),
        model: context.modelDisplayName,
      },
      "success",
    )

    await updateProgress(60, "Structuring chapters...")

    await db
      .update(stories)
      .set({
        scriptText: script,
      })
      .where(eq(stories.id, context.storyId))

    await logger.log("Generating chapter breakdown", {})

    const chapterPromptTemplate = getChapterPrompt(context.story.narrativeStyle)

    const { text: chaptersJson } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      prompt: `${chapterPromptTemplate}

SCRIPT:
${script.slice(0, 8000)}${script.length > 8000 ? `\n\n[... middle section omitted for brevity ...]\n\n${script.slice(-3000)}` : ""}

Output ONLY valid JSON, no other text:`,
      maxOutputTokens: 1000,
      temperature: 0.3,
    })

    let chapters: Array<{
      number: number
      title: string
      start_time_seconds: number
      duration_seconds: number
    }> = []

    try {
      chapters = JSON.parse(chaptersJson.trim())
      console.log("[v0] Chapters parsed:", chapters.length)
      await logger.log("Chapters structured", { chapterCount: chapters.length }, "success")
    } catch {
      console.log("[v0] Chapter parsing failed, using single chapter")
      chapters = [
        {
          number: 1,
          title: "Full Narrative",
          start_time_seconds: 0,
          duration_seconds: targetMinutes * 60,
        },
      ]
      await logger.log("Using single chapter fallback", {}, "warning")
    }

    await db
      .update(stories)
      .set({
        chapters,
        progress: 70,
        progressMessage: "Script complete. Preparing audio synthesis...",
      })
      .where(eq(stories.id, context.storyId))

    return {
      ...context,
      script,
      scriptWordCount: actualWords,
      chapters,
      actualWords,
    }
  }
}
