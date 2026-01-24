import { db, stories } from "@/lib/db"
import { eq } from "drizzle-orm"
import { uploadAudioChunk } from "@/lib/storage"

export const maxDuration = 300

function splitTextIntoChunks(text: string, maxChars = 4000): string[] {
  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining)
      break
    }

    let splitIndex = maxChars
    const searchText = remaining.slice(0, maxChars)

    const lastParagraph = searchText.lastIndexOf("\n\n")
    if (lastParagraph > maxChars * 0.5) {
      splitIndex = lastParagraph + 2
    } else {
      const lastPeriod = searchText.lastIndexOf(". ")
      const lastQuestion = searchText.lastIndexOf("? ")
      const lastExclaim = searchText.lastIndexOf("! ")
      const lastEllipsis = searchText.lastIndexOf("... ")

      splitIndex = Math.max(lastPeriod, lastQuestion, lastExclaim, lastEllipsis)

      if (splitIndex < maxChars * 0.3) {
        splitIndex = searchText.lastIndexOf(" ")
      }

      if (splitIndex > 0) {
        splitIndex += 1
      } else {
        splitIndex = maxChars
      }
    }

    chunks.push(remaining.slice(0, splitIndex).trim())
    remaining = remaining.slice(splitIndex).trim()
  }

  return chunks
}

export async function POST(req: Request) {
  const startTime = Date.now()

  try {
    const { storyId } = await req.json()

    if (!storyId) {
      return Response.json({ error: "storyId is required" }, { status: 400 })
    }

    console.log("[REGEN] Starting audio regeneration for story:", storyId)

    const storyResult = await db
      .select()
      .from(stories)
      .where(eq(stories.id, storyId))

    if (!storyResult || storyResult.length === 0) {
      return Response.json({ error: "Story not found" }, { status: 404 })
    }

    const story = storyResult[0]

    if (!story.scriptText) {
      return Response.json({ error: "Story has no script to synthesize" }, { status: 400 })
    }

    console.log("[REGEN] Story found:", story.title)
    console.log("[REGEN] Script length:", story.scriptText.length)

    await db
      .update(stories)
      .set({
        status: "synthesizing",
        progress: 10,
        progressMessage: "Starting audio regeneration...",
        errorMessage: null,
      })
      .where(eq(stories.id, storyId))

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY
    if (!elevenLabsKey) {
      await db
        .update(stories)
        .set({
          status: "failed",
          errorMessage: "ElevenLabs API key not configured",
        })
        .where(eq(stories.id, storyId))
      return Response.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    const voiceId = story.voiceId || "21m00Tcm4TlvDq8ikWAM"
    const modelId = "eleven_flash_v2_5"
    const maxChunkSize = 10000

    const scriptChunks = splitTextIntoChunks(story.scriptText, maxChunkSize)
    console.log("[REGEN] Script split into", scriptChunks.length, "chunks")

    await db
      .update(stories)
      .set({
        progress: 20,
        progressMessage: `Generating audio (0/${scriptChunks.length} chunks)...`,
      })
      .where(eq(stories.id, storyId))

    const chapterAudioUrls: string[] = []

    for (let i = 0; i < scriptChunks.length; i++) {
      const chunk = scriptChunks[i]
      const chunkNum = i + 1

      const chunkElapsed = Date.now() - startTime
      if (chunkElapsed > 270000) {
        console.log("[REGEN] TIMEOUT WARNING: Stopping to save progress")
        break
      }

      console.log(`[REGEN] Processing chunk ${chunkNum}/${scriptChunks.length}, length: ${chunk.length}`)

      await db
        .update(stories)
        .set({
          progress: 20 + Math.round((i / scriptChunks.length) * 70),
          progressMessage: `Generating audio (${chunkNum}/${scriptChunks.length} chunks)...`,
        })
        .where(eq(stories.id, storyId))

      const audioResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "xi-api-key": elevenLabsKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: chunk,
            model_id: modelId,
            voice_settings: {
              stability: story.narrativeStyle === "fiction" ? 0.35 : 0.5,
              similarity_boost: 0.8,
              style: story.narrativeStyle === "fiction" ? 0.15 : 0,
              use_speaker_boost: true,
            },
            previous_text: i > 0 ? scriptChunks[i - 1].slice(-1000) : undefined,
            next_text: i < scriptChunks.length - 1 ? scriptChunks[i + 1].slice(0, 500) : undefined,
            apply_text_normalization: "auto",
          }),
        },
      )

      if (!audioResponse.ok) {
        const errorText = await audioResponse.text()
        console.error(`[REGEN] ElevenLabs error on chunk ${chunkNum}:`, errorText)
        
        await db
          .update(stories)
          .set({
            status: "failed",
            errorMessage: `ElevenLabs API error on chunk ${chunkNum}: ${errorText.slice(0, 200)}`,
          })
          .where(eq(stories.id, storyId))

        return Response.json({ error: `ElevenLabs API error on chunk ${chunkNum}` }, { status: 500 })
      }

      const buffer = await audioResponse.arrayBuffer()
      console.log(`[REGEN] Chunk ${chunkNum} complete, size: ${buffer.byteLength} bytes`)

      try {
        const chunkUrl = await uploadAudioChunk(buffer, storyId, chunkNum, "audio/mpeg")
        chapterAudioUrls.push(chunkUrl)
        console.log(`[REGEN] Chunk ${chunkNum} uploaded: ${chunkUrl}`)
      } catch (uploadError: any) {
        console.error(`[REGEN] Chunk ${chunkNum} upload error:`, uploadError)
        
        await db
          .update(stories)
          .set({
            status: "failed",
            errorMessage: `Failed to upload chunk ${chunkNum}: ${uploadError.message}`,
          })
          .where(eq(stories.id, storyId))

        return Response.json({ error: `Failed to upload chunk ${chunkNum}` }, { status: 500 })
      }
    }

    if (chapterAudioUrls.length === 0) {
      await db
        .update(stories)
        .set({
          status: "failed",
          errorMessage: "No audio chunks were generated",
        })
        .where(eq(stories.id, storyId))

      return Response.json({ error: "No audio chunks were generated" }, { status: 500 })
    }

    const actualWords = story.scriptText.split(/\s+/).length
    const estimatedDuration = Math.round(actualWords / 2.5)

    const chapters = (story.chapters as any[]) || []
    const updatedChapters = chapters.map((ch: any, idx: number) => ({
      ...ch,
      audio_url: chapterAudioUrls[idx] || chapterAudioUrls[chapterAudioUrls.length - 1],
    }))

    await db
      .update(stories)
      .set({
        audioUrl: chapterAudioUrls[0],
        audioChunks: chapterAudioUrls,
        chapters: updatedChapters,
        actualDurationSeconds: estimatedDuration,
        status: "completed",
        progress: 100,
        progressMessage: "Audio regeneration complete!",
        processingCompletedAt: new Date(),
        errorMessage: null,
      })
      .where(eq(stories.id, storyId))

    console.log("[REGEN] Audio regeneration complete!")
    console.log("[REGEN] Total chunks:", chapterAudioUrls.length)
    console.log("[REGEN] Estimated duration:", estimatedDuration, "seconds")

    return Response.json({
      success: true,
      audioUrl: chapterAudioUrls[0],
      audioChunks: chapterAudioUrls,
      duration: estimatedDuration,
      chunksGenerated: chapterAudioUrls.length,
    })
  } catch (error) {
    console.error("[REGEN] Fatal error:", error)
    return Response.json(
      { error: "Audio regeneration failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
