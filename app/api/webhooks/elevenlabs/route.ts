import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { studioProjects, stories, processingLogs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { WebhookEvent } from "@/lib/generation/elevenlabs-studio"

export async function POST(request: NextRequest) {
  try {
    const body: WebhookEvent = await request.json()
    
    console.log("[ElevenLabs Webhook] Received:", JSON.stringify(body, null, 2))

    if (body.type === "project_conversion_status") {
      const { project_id, conversion_status, project_snapshot_id, error_details } = body.data

      const studioProject = await db.query.studioProjects.findFirst({
        where: eq(studioProjects.elevenLabsProjectId, project_id),
      })

      if (!studioProject) {
        console.log(`[ElevenLabs Webhook] No studio project found for: ${project_id}`)
        return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
      }

      await db.update(studioProjects)
        .set({
          status: conversion_status === "success" ? "completed" : "failed",
          webhookReceived: true,
          metadata: {
            ...(studioProject.metadata as object || {}),
            project_snapshot_id,
            error_details,
            webhook_received_at: new Date().toISOString(),
          },
          updatedAt: new Date(),
        })
        .where(eq(studioProjects.id, studioProject.id))

      if (conversion_status === "success") {
        await db.update(stories)
          .set({
            status: "audio_ready",
            progressMessage: "Studio conversion complete, downloading audio...",
            progress: 80,
          })
          .where(eq(stories.id, studioProject.storyId))

        await db.insert(processingLogs).values({
          storyId: studioProject.storyId,
          agentName: "ElevenLabsWebhook",
          action: "project_completed",
          details: { project_id, project_snapshot_id },
          level: "info",
        })
      } else {
        await db.update(stories)
          .set({
            status: "failed",
            errorMessage: error_details || "Studio conversion failed",
            progressMessage: "Studio conversion failed",
          })
          .where(eq(stories.id, studioProject.storyId))

        await db.insert(processingLogs).values({
          storyId: studioProject.storyId,
          agentName: "ElevenLabsWebhook",
          action: "project_failed",
          details: { project_id, error_details },
          level: "error",
        })
      }

      return NextResponse.json({ success: true })
    }

    if (body.type === "chapter_conversion_status") {
      const { project_id, chapter_id, conversion_status, chapter_snapshot_id, error_details } = body.data

      const studioProject = await db.query.studioProjects.findFirst({
        where: eq(studioProjects.elevenLabsProjectId, project_id),
      })

      if (studioProject) {
        const existingMetadata = studioProject.metadata as object || {}
        const chapters = (existingMetadata as { chapters?: Record<string, unknown> }).chapters || {}
        
        await db.update(studioProjects)
          .set({
            metadata: {
              ...existingMetadata,
              chapters: {
                ...chapters,
                [chapter_id]: {
                  status: conversion_status,
                  snapshot_id: chapter_snapshot_id,
                  error: error_details,
                },
              },
            },
            updatedAt: new Date(),
          })
          .where(eq(studioProjects.id, studioProject.id))

        await db.insert(processingLogs).values({
          storyId: studioProject.storyId,
          agentName: "ElevenLabsWebhook",
          action: conversion_status === "success" ? "chapter_completed" : "chapter_failed",
          details: { project_id, chapter_id, chapter_snapshot_id, error_details },
          level: conversion_status === "success" ? "info" : "error",
        })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true, message: "Unknown event type" })
  } catch (error) {
    console.error("[ElevenLabs Webhook] Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "ElevenLabs webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
