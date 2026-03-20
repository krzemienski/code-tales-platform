import { db, stories } from "@/lib/db"
import { eq } from "drizzle-orm"
import { writeLog, type LogLevel } from "@/lib/agents/log-helper"
import type { AgentSkill, AgentSkillLogger, PipelineContext } from "./skills/types"

export interface PipelineConfig {
  agents: AgentSkill[]
  context: PipelineContext
}

function createLogger(storyId: string, agentName: string): AgentSkillLogger {
  return {
    log: async (action: string, details?: Record<string, any>, level?: LogLevel) => {
      await writeLog(storyId, agentName as any, action, details, level)
    },
  }
}

async function updateStoryProgress(
  storyId: string,
  progress: number,
  message: string,
  statusOverride?: string,
): Promise<void> {
  const update: Record<string, any> = {
    progress,
    progressMessage: message,
    updatedAt: new Date(),
  }
  if (statusOverride) {
    update.status = statusOverride
  }
  try {
    await db
      .update(stories)
      .set(update)
      .where(eq(stories.id, storyId))
  } catch (error) {
    console.error("[v0] Failed to update story progress:", error)
  }
}

export async function runPipeline(config: PipelineConfig): Promise<PipelineContext> {
  let context = config.context

  await writeLog(context.storyId, "System", "Pipeline started", {
    agents: config.agents.map((a) => a.metadata.name),
    model: context.selectedModelId,
    style: context.story.narrativeStyle,
  })

  for (const agent of config.agents) {
    const skillStart = Date.now()
    console.log(`[orchestrator] Running skill: ${agent.metadata.name}`)

    const logger = createLogger(context.storyId, agent.metadata.name)
    const progressUpdater = (progress: number, message: string, statusOverride?: string) =>
      updateStoryProgress(context.storyId, progress, message, statusOverride)

    try {
      context = await agent.execute(context, logger, progressUpdater)

      const elapsed = Date.now() - skillStart
      console.log(`[orchestrator] Skill ${agent.metadata.name} completed in ${elapsed}ms`)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      console.error(`[orchestrator] Skill ${agent.metadata.name} failed:`, errMsg)

      await logger.log(
        `${agent.metadata.name} failed`,
        { error: errMsg },
        "error",
      )

      context.failedAgent = agent.metadata.name
      throw error
    }
  }

  await writeLog(context.storyId, "System", "Pipeline complete", {
    agents: config.agents.map((a) => a.metadata.name),
    totalDuration: Date.now() - context.startTime,
  }, "success")

  return context
}
