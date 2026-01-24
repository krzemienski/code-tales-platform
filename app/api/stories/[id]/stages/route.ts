import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { stageMetrics } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: storyId } = await params

  try {
    const stages = await db.query.stageMetrics.findMany({
      where: eq(stageMetrics.storyId, storyId),
      orderBy: [stageMetrics.stageOrder],
    })

    return NextResponse.json({
      storyId,
      stages: stages.map(s => ({
        id: s.id,
        stageName: s.stageName,
        stageOrder: s.stageOrder,
        status: s.status,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        durationMs: s.durationMs,
        inputTokens: s.inputTokens,
        outputTokens: s.outputTokens,
        costEstimate: s.costEstimate,
        promptUsed: s.promptUsed,
        responsePreview: s.responsePreview,
        metadata: s.metadata,
      })),
      totalStages: stages.length,
      completedStages: stages.filter(s => s.status === "completed").length,
      currentStage: stages.find(s => s.status === "running"),
    })
  } catch (error) {
    console.error("[stages] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
