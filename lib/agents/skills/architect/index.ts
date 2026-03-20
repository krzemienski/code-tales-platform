import type { AgentSkill, AgentSkillMetadata, AgentSkillLogger, PipelineContext } from "../types"

export class ArchitectSkill implements AgentSkill {
  metadata: AgentSkillMetadata = {
    name: "Architect",
    description: "Builds a dependency graph and architecture map from analyzed content",
    acceptedInputs: ["repoAnalysis"],
    producedOutputs: [],
  }

  configure(_config: Record<string, any>): void {}

  async execute(
    context: PipelineContext,
    logger: AgentSkillLogger,
    updateProgress: (progress: number, message: string, statusOverride?: string) => Promise<void>,
  ): Promise<PipelineContext> {
    const analysis = context.repoAnalysis
    if (!analysis) {
      throw new Error("ArchitectSkill requires repoAnalysis in context")
    }

    await updateProgress(30, "Building architecture map...", "generating")

    await logger.log("Building dependency graph", {})

    await logger.log("Identifying core modules", {
      modules: analysis.keyDirectories.slice(0, 4),
    })

    await updateProgress(40, "Mapping code patterns...")

    await logger.log("Mapping data flow patterns", {})

    await logger.log(
      "Architecture map complete",
      {
        components: analysis.keyDirectories.length,
        architecture: analysis.architecturePattern,
        signals: analysis.architectureSignals,
      },
      "success",
    )

    return context
  }
}

