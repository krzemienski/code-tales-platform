import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { stories, studioProjects, codeRepositories, processingLogs, stageMetrics } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import {
  createGenFMPodcast,
  createAudiobookProject,
  waitForProjectCompletion,
  downloadProjectAudio,
  type StudioProject,
} from "@/lib/generation/elevenlabs-studio"
import type { StudioModeConfig } from "@/lib/generation/modes"
import { uploadAudioChunk } from "@/lib/storage"

interface GenerateStudioRequest {
  storyId: string
  repositoryUrl: string
  repositoryAnalysis: string
  format: "podcast" | "audiobook"
  config: {
    hostVoiceId: string
    guestVoiceId?: string
    duration: "short" | "default" | "long"
    qualityPreset?: "standard" | "high" | "ultra" | "ultra_lossless"
    instructionsPrompt?: string
    intro?: string
    outro?: string
    language?: string
  }
}

async function logStage(
  storyId: string,
  stageName: string,
  stageOrder: number,
  status: "running" | "completed" | "failed",
  data?: Partial<{
    durationMs: number
    inputTokens: number
    outputTokens: number
    costEstimate: string
    promptUsed: string
    responsePreview: string
    metadata: Record<string, unknown>
  }>
) {
  if (status === "running") {
    await db.insert(stageMetrics).values({
      storyId,
      stageName,
      stageOrder,
      status: "running",
      startedAt: new Date(),
      ...data,
    })
  } else {
    const existing = await db.query.stageMetrics.findFirst({
      where: and(
        eq(stageMetrics.storyId, storyId),
        eq(stageMetrics.stageName, stageName)
      ),
      orderBy: (m, { desc }) => [desc(m.createdAt)],
    })
    
    if (existing) {
      const endedAt = new Date()
      const durationMs = endedAt.getTime() - new Date(existing.startedAt!).getTime()
      
      await db.update(stageMetrics)
        .set({
          status,
          endedAt,
          durationMs,
          ...data,
        })
        .where(eq(stageMetrics.id, existing.id))
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateStudioRequest = await request.json()
    const { storyId, repositoryUrl, repositoryAnalysis, format, config } = body

    if (!storyId || !repositoryUrl || !repositoryAnalysis || !format) {
      return NextResponse.json(
        { error: "Missing required fields: storyId, repositoryUrl, repositoryAnalysis, format" },
        { status: 400 }
      )
    }

    const story = await db.query.stories.findFirst({
      where: eq(stories.id, storyId),
    })

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    await db.update(stories)
      .set({
        status: "processing",
        generationMode: `studio_${format}`,
        progress: 5,
        progressMessage: "Starting Studio generation...",
        processingStartedAt: new Date(),
      })
      .where(eq(stories.id, storyId))

    await logStage(storyId, "studio_init", 1, "running", {
      metadata: { format, config },
    })

    const studioConfig: StudioModeConfig = {
      format,
      duration: config.duration,
      hosts: {
        main: config.hostVoiceId,
        guest: config.guestVoiceId,
      },
      qualityPreset: config.qualityPreset || "high",
      instructionsPrompt: config.instructionsPrompt,
      intro: config.intro,
      outro: config.outro,
      language: config.language || "en",
    }

    let callbackUrl: string | undefined
    if (process.env.ELEVENLABS_WEBHOOK_URL) {
      callbackUrl = process.env.ELEVENLABS_WEBHOOK_URL
    } else if (process.env.REPLIT_DEV_DOMAIN) {
      callbackUrl = `https://${process.env.REPLIT_DEV_DOMAIN}/api/webhooks/elevenlabs`
    }

    await db.insert(processingLogs).values({
      storyId,
      agentName: "StudioGenerator",
      action: "starting_studio_generation",
      details: { format, config: studioConfig },
      level: "info",
    })

    let studioProject: StudioProject

    try {
      await logStage(storyId, "studio_init", 1, "completed")
      await logStage(storyId, "studio_create", 2, "running", {
        promptUsed: `Creating ${format} from repository analysis...`,
        metadata: { format, repositoryUrl },
      })

      await db.update(stories)
        .set({
          progress: 15,
          progressMessage: `Creating ${format === "podcast" ? "GenFM podcast" : "audiobook project"}...`,
        })
        .where(eq(stories.id, storyId))

      if (format === "podcast") {
        studioProject = await createGenFMPodcast(repositoryAnalysis, studioConfig, callbackUrl)
      } else {
        studioProject = await createAudiobookProject(
          story.title,
          repositoryAnalysis,
          studioConfig,
          callbackUrl
        )
      }

      await db.insert(studioProjects).values({
        storyId,
        elevenLabsProjectId: studioProject.project_id,
        projectType: format,
        status: studioProject.state,
        metadata: { 
          studioProject,
          config: studioConfig,
        },
      })

      await logStage(storyId, "studio_create", 2, "completed", {
        responsePreview: `Project created: ${studioProject.project_id}`,
      })

      await db.insert(processingLogs).values({
        storyId,
        agentName: "StudioGenerator",
        action: "studio_project_created",
        details: { 
          projectId: studioProject.project_id,
          state: studioProject.state,
        },
        level: "info",
      })

    } catch (error) {
      await logStage(storyId, "studio_create", 2, "failed", {
        metadata: { error: error instanceof Error ? error.message : "Unknown error" },
      })
      throw error
    }

    await logStage(storyId, "studio_convert", 3, "running")
    await db.update(stories)
      .set({
        progress: 30,
        progressMessage: "Waiting for audio conversion...",
      })
      .where(eq(stories.id, storyId))

    try {
      const completedProject = await waitForProjectCompletion(
        studioProject.project_id,
        600000, // 10 minutes
        5000,
        async (project) => {
          await db.update(stories)
            .set({
              progress: 30 + Math.floor((project.chapters?.length || 0) * 5),
              progressMessage: `Converting audio: ${project.state}...`,
            })
            .where(eq(stories.id, storyId))
        }
      )

      await logStage(storyId, "studio_convert", 3, "completed")

      await logStage(storyId, "studio_download", 4, "running")
      await db.update(stories)
        .set({
          progress: 70,
          progressMessage: "Downloading audio from Studio...",
        })
        .where(eq(stories.id, storyId))

      const audioChunks = await downloadProjectAudio(studioProject.project_id)

      await db.insert(processingLogs).values({
        storyId,
        agentName: "StudioGenerator",
        action: "audio_downloaded",
        details: { chunkCount: audioChunks.length },
        level: "info",
      })

      await logStage(storyId, "studio_download", 4, "completed")
      await logStage(storyId, "studio_upload", 5, "running")

      await db.update(stories)
        .set({
          progress: 85,
          progressMessage: "Uploading audio to storage...",
        })
        .where(eq(stories.id, storyId))

      const uploadedChunks: string[] = []
      let totalDuration = 0

      for (let i = 0; i < audioChunks.length; i++) {
        const chunk = audioChunks[i]
        const buffer = Buffer.from(chunk.audio)
        const path = await uploadAudioChunk(buffer, storyId, i)
        uploadedChunks.push(path)
        totalDuration += 60 // Estimate 60s per chunk
      }

      await logStage(storyId, "studio_upload", 5, "completed")

      await db.update(stories)
        .set({
          status: "completed",
          progress: 100,
          progressMessage: "Generation complete!",
          audioChunks: uploadedChunks,
          audioUrl: uploadedChunks[0],
          actualDurationSeconds: totalDuration,
          processingCompletedAt: new Date(),
        })
        .where(eq(stories.id, storyId))

      await db.update(studioProjects)
        .set({
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(studioProjects.elevenLabsProjectId, studioProject.project_id))

      await db.insert(processingLogs).values({
        storyId,
        agentName: "StudioGenerator",
        action: "generation_complete",
        details: { 
          chunkCount: uploadedChunks.length,
          duration: totalDuration,
        },
        level: "info",
      })

      return NextResponse.json({
        success: true,
        storyId,
        projectId: studioProject.project_id,
        audioChunks: uploadedChunks,
        duration: totalDuration,
      })

    } catch (pollError) {
      await logStage(storyId, "studio_convert", 3, "failed", {
        metadata: { error: pollError instanceof Error ? pollError.message : "Unknown error" },
      })

      await db.update(stories)
        .set({
          status: "failed",
          errorMessage: pollError instanceof Error ? pollError.message : "Conversion failed",
          progressMessage: "Audio conversion failed",
        })
        .where(eq(stories.id, storyId))

      throw pollError
    }

  } catch (error) {
    console.error("[generate-studio] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
