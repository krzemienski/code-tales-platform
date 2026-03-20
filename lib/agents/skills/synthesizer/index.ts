import { db, stories } from "@/lib/db"
import { eq } from "drizzle-orm"
import { uploadAudioChunk } from "@/lib/storage"
import type { AgentSkill, AgentSkillMetadata, AgentSkillLogger, PipelineContext } from "../types"

interface TTSRequestBody {
  text: string
  model_id: string
  voice_settings: {
    stability: number
    similarity_boost: number
    style: number
    use_speaker_boost: boolean
  }
  previous_text?: string
  next_text?: string
  apply_text_normalization: string
  language_code?: string
}

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

export class SynthesizerSkill implements AgentSkill {
  metadata: AgentSkillMetadata = {
    name: "Synthesizer",
    description: "Synthesizes audio from script text using ElevenLabs TTS API",
    acceptedInputs: ["script", "actualWords", "voiceId", "ttsConfig"],
    producedOutputs: ["audioUrl", "audioChunks", "estimatedDuration"],
  }

  configure(_config: Record<string, any>): void {}

  async execute(
    context: PipelineContext,
    logger: AgentSkillLogger,
    updateProgress: (progress: number, message: string, statusOverride?: string) => Promise<void>,
  ): Promise<PipelineContext> {
    const script = context.script
    const actualWords = context.actualWords || context.scriptWordCount || 0
    if (!script) {
      throw new Error("SynthesizerSkill requires script in context")
    }

    const elapsedMs = Date.now() - context.startTime
    console.log("[v0] Elapsed time before audio synthesis:", Math.round(elapsedMs / 1000), "seconds")

    const TIMEOUT_WARNING_MS = 240000

    if (elapsedMs > TIMEOUT_WARNING_MS) {
      console.log("[v0] WARNING: Running low on time, may not complete audio synthesis")
      await logger.log(
        "Time warning - audio synthesis may be interrupted",
        {
          elapsedSeconds: Math.round(elapsedMs / 1000),
          remainingSeconds: Math.round((300000 - elapsedMs) / 1000),
        },
        "warning",
      )
    }

    await updateProgress(75, "Initializing ElevenLabs...", "synthesizing")

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY
    console.log("[v0] ElevenLabs key available:", !!elevenLabsKey)

    if (!elevenLabsKey) {
      console.log("[v0] No ElevenLabs key, completing without audio")
      await logger.log("ElevenLabs API key not configured", {}, "warning")
      return context
    }

    const voiceId = context.voiceId || context.story.voiceId || "21m00Tcm4TlvDq8ikWAM"
    const ttsConfig = context.ttsConfig || {}
    const ttsModelId = ttsConfig.ttsModelId || "eleven_flash_v2_5"
    const ttsOutputFormat = ttsConfig.outputFormat || "mp3_44100_128"
    const ttsVoiceSettings = {
      stability: ttsConfig.stability ?? (context.story.narrativeStyle === "fiction" ? 0.35 : 0.5),
      similarity_boost: ttsConfig.similarityBoost ?? 0.8,
      style: ttsConfig.style ?? (context.story.narrativeStyle === "fiction" ? 0.15 : 0),
      use_speaker_boost: ttsConfig.useSpeakerBoost ?? true,
    }
    const ttsLanguage = ttsConfig.language || undefined

    const modelId = ttsModelId
    const maxChunkSize = 10000

    await logger.log("Initializing ElevenLabs voice synthesis", {
      voice: voiceId,
      model: modelId,
      outputFormat: ttsOutputFormat,
      voiceSettings: ttsVoiceSettings,
      language: ttsLanguage,
      totalScriptLength: script.length,
    })

    const scriptChunks = splitTextIntoChunks(script, maxChunkSize)
    console.log("[v0] Script split into", scriptChunks.length, "chunks using model:", modelId)

    await logger.log("Script chunked for synthesis", {
      totalLength: script.length,
      chunks: scriptChunks.length,
      chunkLengths: scriptChunks.map((c) => c.length),
    })

    await updateProgress(78, `Generating audio (0/${scriptChunks.length} chunks)...`)

    const audioBuffers: ArrayBuffer[] = []
    const chapterAudioUrls: string[] = []

    for (let i = 0; i < scriptChunks.length; i++) {
      const chunk = scriptChunks[i]
      const chunkNum = i + 1

      const chunkElapsed = Date.now() - context.startTime
      if (chunkElapsed > 270000) {
        console.log("[v0] TIMEOUT WARNING: Stopping audio generation to save progress")
        await logger.log(
          "Timeout - saving partial progress",
          {
            completedChunks: i,
            totalChunks: scriptChunks.length,
          },
          "warning",
        )

        if (chapterAudioUrls.length > 0) {
          const partialDuration = Math.round(
            ((actualWords / scriptChunks.length) * chapterAudioUrls.length) / 2.5,
          )

          await db
            .update(stories)
            .set({
              audioUrl: chapterAudioUrls[0],
              audioChunks: chapterAudioUrls,
              actualDurationSeconds: partialDuration,
              status: "completed",
              progress: 100,
              progressMessage: `Completed with ${chapterAudioUrls.length}/${scriptChunks.length} audio chunks (timeout)`,
              processingCompletedAt: new Date(),
            })
            .where(eq(stories.id, context.storyId))

          return {
            ...context,
            audioUrl: chapterAudioUrls[0],
            audioChunks: chapterAudioUrls,
            estimatedDuration: partialDuration,
            partial: true,
            completedChunks: chapterAudioUrls.length,
            totalChunks: scriptChunks.length,
          }
        }
        break
      }

      console.log(`[v0] Processing chunk ${chunkNum}/${scriptChunks.length}, length: ${chunk.length}`)

      await logger.log(`Processing chunk ${chunkNum}/${scriptChunks.length}`, {
        chunkLength: chunk.length,
        preview: chunk.slice(0, 100) + "...",
      })

      await updateProgress(
        78 + Math.round((i / scriptChunks.length) * 15),
        `Generating audio (${chunkNum}/${scriptChunks.length} chunks)...`,
      )

      const ttsBody: TTSRequestBody = {
        text: chunk,
        model_id: modelId,
        voice_settings: ttsVoiceSettings,
        previous_text: i > 0 ? scriptChunks[i - 1].slice(-1000) : undefined,
        next_text: i < scriptChunks.length - 1 ? scriptChunks[i + 1].slice(0, 500) : undefined,
        apply_text_normalization: "auto",
        language_code: ttsLanguage && ttsLanguage !== "en" ? ttsLanguage : undefined,
      }

      const audioResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${ttsOutputFormat}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": elevenLabsKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ttsBody),
        },
      )

      if (!audioResponse.ok) {
        const errorText = await audioResponse.text()
        console.error(`[v0] ElevenLabs error on chunk ${chunkNum}:`, errorText)
        await logger.log(
          `Chunk ${chunkNum} failed`,
          {
            status: audioResponse.status,
            error: errorText.slice(0, 200),
          },
          "error",
        )
        throw new Error(`ElevenLabs API error on chunk ${chunkNum}: ${errorText}`)
      }

      const buffer = await audioResponse.arrayBuffer()
      audioBuffers.push(buffer)

      console.log(`[v0] Chunk ${chunkNum} complete, size: ${buffer.byteLength} bytes`)

      await logger.log(
        `Chunk ${chunkNum} complete`,
        {
          sizeBytes: buffer.byteLength,
        },
        "success",
      )

      const audioMimeType = ttsOutputFormat.startsWith("mp3") ? "audio/mpeg"
        : ttsOutputFormat.startsWith("pcm") ? "audio/pcm"
        : ttsOutputFormat.startsWith("ulaw") ? "audio/basic"
        : "audio/mpeg"
      const chunkUrl = await uploadAudioChunk(buffer, context.storyId, chunkNum, audioMimeType)
      chapterAudioUrls.push(chunkUrl)
      console.log(`[v0] Chunk ${chunkNum} uploaded: ${chunkUrl}`)
    }

    const totalBytes = audioBuffers.reduce((sum, b) => sum + b.byteLength, 0)
    console.log("[v0] All chunks synthesized and uploaded, total bytes:", totalBytes)

    await logger.log(
      "All audio chunks uploaded",
      {
        totalChunks: chapterAudioUrls.length,
        totalBytes,
      },
      "success",
    )

    const estimatedDuration = Math.round(actualWords / 2.5)

    await logger.log(
      "Audio processing complete",
      {
        mainUrl: chapterAudioUrls[0],
        chunkCount: chapterAudioUrls.length,
        durationSeconds: estimatedDuration,
      },
      "success",
    )

    return {
      ...context,
      audioUrl: chapterAudioUrls[0] || undefined,
      audioChunks: chapterAudioUrls,
      estimatedDuration,
    }
  }
}

export { splitTextIntoChunks }
