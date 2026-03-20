import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { stories, stageMetrics, processingLogs } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: storyId } = await params
  if (!UUID_RE.test(storyId)) return new Response(JSON.stringify({ error: "Invalid story ID" }), { status: 400, headers: { "Content-Type": "application/json" } })

  const story = await db.query.stories.findFirst({
    where: eq(stories.id, storyId),
  })

  if (!story) {
    return new Response(JSON.stringify({ error: "Story not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const encoder = new TextEncoder()
  let isActive = true

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        if (!isActive) return
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
        try {
          controller.enqueue(encoder.encode(message))
        } catch {
          isActive = false
        }
      }

      const poll = async () => {
        while (isActive) {
          try {
            const [currentStory, stages, recentLogs] = await Promise.all([
              db.query.stories.findFirst({
                where: eq(stories.id, storyId),
              }),
              db.query.stageMetrics.findMany({
                where: eq(stageMetrics.storyId, storyId),
                orderBy: [stageMetrics.stageOrder],
              }),
              db.query.processingLogs.findMany({
                where: eq(processingLogs.storyId, storyId),
                orderBy: [desc(processingLogs.timestamp)],
                limit: 20,
              }),
            ])

            if (!currentStory) {
              sendEvent("error", { message: "Story not found" })
              isActive = false
              break
            }

            sendEvent("status", {
              storyId,
              status: currentStory.status,
              progress: currentStory.progress,
              progressMessage: currentStory.progressMessage,
              generationMode: currentStory.generationMode,
              processingStartedAt: currentStory.processingStartedAt,
              processingCompletedAt: currentStory.processingCompletedAt,
              errorMessage: currentStory.errorMessage,
            })

            sendEvent("stages", stages.map(s => ({
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
              promptUsed: s.promptUsed?.substring(0, 500),
              responsePreview: s.responsePreview?.substring(0, 500),
              metadata: s.metadata,
            })))

            sendEvent("logs", recentLogs.reverse().map(l => ({
              id: l.id,
              timestamp: l.timestamp,
              agentName: l.agentName,
              action: l.action,
              level: l.level,
              details: l.details,
            })))

            if (currentStory.status === "completed" || currentStory.status === "failed") {
              sendEvent("complete", { 
                status: currentStory.status,
                audioUrl: currentStory.audioUrl,
                audioChunks: currentStory.audioChunks,
                actualDurationSeconds: currentStory.actualDurationSeconds,
              })
              isActive = false
              break
            }

            await new Promise(resolve => setTimeout(resolve, 2000))
          } catch (error) {
            console.error("[SSE] Error:", error)
            sendEvent("error", { message: error instanceof Error ? error.message : "Unknown error" })
            await new Promise(resolve => setTimeout(resolve, 5000))
          }
        }

        try {
          controller.close()
        } catch {
        }
      }

      poll()
    },
    cancel() {
      isActive = false
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
