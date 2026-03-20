// Story Generation API - Orchestrates the full pipeline with detailed logging

import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { db, stories, codeRepositories, storyIntents } from "@/lib/db"
import { eq } from "drizzle-orm"
import { analyzeRepository, summarizeRepoStructure } from "@/lib/agents/github"
import { getStoryPrompt } from "@/lib/agents/prompts"
import { log } from "@/lib/agents/log-helper"
import { AI_MODELS, getModelConfiguration, getPromptOptimizations, recommendModel } from "@/lib/ai/models"
import { uploadAudioChunk } from "@/lib/storage"

export const maxDuration = 300 // 5 minutes max (Vercel limit)

interface GenerateRequest {
  storyId: string
  modelConfig?: {
    modelId?: string
    temperature?: number
  }
}

interface StoredModelConfig {
  modelId?: string
  priority?: string
  ttsConfig?: {
    ttsModelId?: string
    stability?: number
    similarityBoost?: number
    style?: number
    useSpeakerBoost?: boolean
    outputFormat?: string
    language?: string
  }
}

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

    // Find the last sentence boundary within the limit
    let splitIndex = maxChars
    const searchText = remaining.slice(0, maxChars)

    // Try to split on paragraph breaks first
    const lastParagraph = searchText.lastIndexOf("\n\n")
    if (lastParagraph > maxChars * 0.5) {
      splitIndex = lastParagraph + 2
    } else {
      // Fall back to sentence boundaries
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
  const TIMEOUT_WARNING_MS = 240000 // 4 minutes - warn before Vercel cuts us off

  try {
    const { storyId, modelConfig }: GenerateRequest = await req.json()

    console.log("[v0] ====== TALE GENERATION STARTED ======")
    console.log("[v0] Tale ID:", storyId)
    console.log("[v0] Model Config:", modelConfig)
    console.log("[v0] Timestamp:", new Date().toISOString())

    if (!storyId || typeof storyId !== 'string') {
      console.error("[v0] Invalid or missing storyId")
      return Response.json({ error: "Missing required field: storyId" }, { status: 400 })
    }

    console.log("[v0] Storage client initialized (using Replit Object Storage)")

    try {
      await log.system(storyId, "Tale generation initiated", { storyId, timestamp: new Date().toISOString() })
      console.log("[v0] Initial log written successfully")
    } catch (logError) {
      console.error("[v0] Warning: Log writing failed:", logError)
    }

    // Fetch tale details with repository join
    console.log("[v0] Fetching tale details...")
    let story
    let repo
    try {
      const storyResult = await db
        .select()
        .from(stories)
        .leftJoin(codeRepositories, eq(stories.repositoryId, codeRepositories.id))
        .where(eq(stories.id, storyId))

      if (!storyResult || storyResult.length === 0) {
        console.error("[v0] Tale not found")
        await log.system(storyId, "Tale not found", { error: "No story found with given ID" }, "error")
        return Response.json({ error: "Tale not found" }, { status: 404 })
      }

      story = storyResult[0].stories
      repo = storyResult[0].code_repositories
    } catch (dbError) {
      console.error("[v0] Database error fetching tale:", dbError)
      await log.system(storyId, "Tale not found", { error: String(dbError) }, "error")
      return Response.json({ error: "Tale not found" }, { status: 404 })
    }

    const targetMinutes = story.targetDurationMinutes || 15
    const storedModelConf = (story.modelConfig || {}) as StoredModelConfig
    let selectedModelId = modelConfig?.modelId || storedModelConf.modelId

    // If no model specified, auto-recommend based on content
    if (!selectedModelId || !AI_MODELS[selectedModelId]?.isAvailable) {
      const recommended = recommendModel({
        narrativeStyle: story.narrativeStyle,
        expertiseLevel: story.expertiseLevel || "intermediate",
        targetDurationMinutes: targetMinutes,
        prioritize: storedModelConf.priority || "quality",
      })
      selectedModelId = recommended.id
      console.log("[v0] Auto-selected model:", selectedModelId)
    }

    const modelDef = AI_MODELS[selectedModelId]
    const modelConfigData = getModelConfiguration(selectedModelId, story.narrativeStyle, targetMinutes)
    const promptOptimizations = getPromptOptimizations(selectedModelId)

    // Override temperature if specified
    if (modelConfig?.temperature !== undefined) {
      modelConfigData.temperature = modelConfig.temperature
    }

    console.log("[v0] Tale loaded:", story.title)
    console.log("[v0] Using model:", modelDef.displayName, "(", selectedModelId, ")")
    console.log("[v0] Model config:", modelConfigData)

    // Fetch intent data if available for enhanced personalization
    let intentContext = ""
    if (story.intentId) {
      console.log("[v0] Fetching intent data for tale...")
      try {
        const intentResult = await db
          .select({
            userDescription: storyIntents.userDescription,
            focusAreas: storyIntents.focusAreas,
            intentCategory: storyIntents.intentCategory,
          })
          .from(storyIntents)
          .where(eq(storyIntents.id, story.intentId))

        if (intentResult && intentResult.length > 0) {
          const intent = intentResult[0]
          intentContext = `
USER'S LEARNING GOAL: ${intent.userDescription || "General exploration"}
FOCUS AREAS: ${(intent.focusAreas as string[])?.join(", ") || "All areas"}
INTENT TYPE: ${intent.intentCategory || "general"}`
          console.log("[v0] Intent context loaded:", intent.intentCategory)
        }
      } catch (intentError) {
        console.error("[v0] Error fetching intent:", intentError)
      }
    }

    await log.system(storyId, "Tale configuration loaded", {
      title: story.title,
      style: story.narrativeStyle,
      duration: story.targetDurationMinutes,
      model: selectedModelId,
    })

    try {
      // Update status to analyzing
      try {
        await db
          .update(stories)
          .set({
            status: "analyzing",
            progress: 5,
            progressMessage: "Connecting to GitHub...",
            processingStartedAt: new Date(),
          })
          .where(eq(stories.id, storyId))
      } catch (updateError) {
        console.error("[v0] Failed to update tale status:", updateError)
      }

      // ===== ANALYZER AGENT =====
      await log.analyzer(storyId, "Connecting to GitHub API", {
        repo: `${repo!.repoOwner}/${repo!.repoName}`,
      })

      await db
        .update(stories)
        .set({
          progress: 10,
          progressMessage: "Fetching repository metadata...",
        })
        .where(eq(stories.id, storyId))

      await log.analyzer(storyId, "Fetching repository metadata", {})

      // Step 1: Analyze repository
      console.log("[v0] Analyzing repository:", repo!.repoOwner, repo!.repoName)
      const analysis = await analyzeRepository(repo!.repoOwner, repo!.repoName)

      await log.analyzer(
        storyId,
        "Repository metadata retrieved",
        {
          stars: analysis.metadata?.stargazers_count,
          forks: analysis.metadata?.forks_count,
          language: analysis.metadata?.language,
        },
        "success",
      )

      await db
        .update(stories)
        .set({
          progress: 15,
          progressMessage: "Scanning directory structure...",
        })
        .where(eq(stories.id, storyId))

      await log.analyzer(storyId, "Scanning directory structure", {
        totalFiles: analysis.structure.length,
      })

      await log.analyzer(
        storyId,
        "Identified key directories",
        {
          directories: analysis.keyDirectories.slice(0, 5),
        },
        "success",
      )

      const repoSummary = summarizeRepoStructure(analysis)
      console.log("[v0] Repo analysis complete, summary length:", repoSummary.length)

      await log.analyzer(
        storyId,
        "Analysis complete",
        {
          filesAnalyzed: analysis.structure.length,
          keyDirectories: analysis.keyDirectories.length,
        },
        "success",
      )

      // Cache analysis
      await db
        .update(codeRepositories)
        .set({
          analysisCache: analysis,
          analysisCachedAt: new Date(),
        })
        .where(eq(codeRepositories.id, repo!.id))

      // ===== ARCHITECT AGENT =====
      await db
        .update(stories)
        .set({
          status: "generating",
          progress: 30,
          progressMessage: "Building architecture map...",
        })
        .where(eq(stories.id, storyId))

      await log.architect(storyId, "Building dependency graph", {})

      await log.architect(storyId, "Identifying core modules", {
        modules: analysis.keyDirectories.slice(0, 4),
      })

      await db
        .update(stories)
        .set({
          progress: 40,
          progressMessage: "Mapping code patterns...",
        })
        .where(eq(stories.id, storyId))

      await log.architect(storyId, "Mapping data flow patterns", {})

      await log.architect(
        storyId,
        "Architecture map complete",
        {
          components: analysis.keyDirectories.length,
        },
        "success",
      )

      // ===== NARRATOR AGENT =====
      await db
        .update(stories)
        .set({
          progress: 50,
          progressMessage: `Generating narrative with ${modelDef.displayName}...`,
        })
        .where(eq(stories.id, storyId))

      await log.narrator(storyId, "Generating narrative outline", {
        style: story.narrativeStyle,
        targetMinutes: story.targetDurationMinutes,
        model: modelDef.displayName,
      })

      const baseSystemPrompt = getStoryPrompt(story.narrativeStyle, story.expertiseLevel || "intermediate")
      const systemPrompt = [
        promptOptimizations.systemPromptPrefix,
        baseSystemPrompt,
        promptOptimizations.specialInstructions,
        promptOptimizations.systemPromptSuffix,
      ]
        .filter(Boolean)
        .join("\n\n")

      const targetWords = targetMinutes * 150

      console.log(
        "[v0] Generating script with",
        modelDef.displayName,
        ", target words:",
        targetWords,
        "maxTokens:",
        modelConfigData.maxTokens,
      )

      await log.narrator(storyId, `Writing script with ${modelDef.displayName}`, {
        model: selectedModelId,
        targetWords,
        maxTokens: modelConfigData.maxTokens,
        temperature: modelConfigData.temperature,
        style: story.narrativeStyle,
      })

      let script: string
      try {
        // Extract model name from provider/model format
        const modelName = selectedModelId.includes("/") 
          ? selectedModelId.split("/")[1] 
          : selectedModelId
        console.log("[v0] Calling AI API with model:", modelName)
        const result = await generateText({
          model: anthropic(modelName),
          system: systemPrompt,
          prompt: `Create an audio narrative script for the repository ${repo!.repoOwner}/${repo!.repoName}.

NARRATIVE STYLE: ${story.narrativeStyle.toUpperCase()}
TARGET DURATION: ${targetMinutes} minutes (~${targetWords} words)
USER'S INTENT: ${story.title}
${intentContext}

REPOSITORY ANALYSIS:
${repoSummary}

KEY DIRECTORIES TO COVER:
${analysis.keyDirectories.slice(0, 15).join("\n")}

CRITICAL INSTRUCTIONS:
1. You MUST generate approximately ${targetWords} words - this is a ${targetMinutes}-minute audio experience
2. Style is "${story.narrativeStyle}" - fully commit to this style throughout
3. ${story.narrativeStyle === "fiction" ? "Create a complete fictional world with characters, plot, conflict, and resolution. Code components ARE your characters." : ""}
4. Cover ALL major aspects of the codebase - do not rush or summarize
5. Include natural pauses (...) for dramatic effect and breathing
6. Organize into clear sections with smooth transitions
7. Do NOT include any markdown headers or formatting - just natural prose with paragraph breaks
8. Make it engaging enough that someone would want to listen for the full ${targetMinutes} minutes

BEGIN YOUR ${targetMinutes}-MINUTE ${story.narrativeStyle.toUpperCase()} NARRATIVE NOW:`,
          maxOutputTokens: modelConfigData.maxTokens,
          temperature: modelConfigData.temperature,
        })
        script = result.text
        console.log("[v0] AI API call successful, generated", script.split(/\s+/).length, "words")

        if (result.usage) {
          console.log("[v0] Token usage:", result.usage)
          await log.narrator(
            storyId,
            "Generation complete",
            {
              model: selectedModelId,
              inputTokens: result.usage.inputTokens,
              outputTokens: result.usage.outputTokens,
              totalTokens: result.usage.totalTokens,
            },
            "success",
          )
        }
      } catch (aiError) {
        console.error("[v0] AI API error:", aiError)
        await log.narrator(storyId, `${modelDef.displayName} API failed`, { error: String(aiError) }, "error")

        await db
          .update(stories)
          .set({
            status: "failed",
            errorMessage: `AI API error (${modelDef.displayName}): ${aiError instanceof Error ? aiError.message : String(aiError)}`,
            processingCompletedAt: new Date(),
          })
          .where(eq(stories.id, storyId))

        return Response.json({ error: "AI API failed", details: String(aiError) }, { status: 500 })
      }

      const actualWords = script.split(/\s+/).length
      console.log("[v0] Script generated, actual words:", actualWords)

      await log.narrator(
        storyId,
        "Script draft complete",
        {
          words: actualWords,
          estimatedMinutes: Math.round(actualWords / 150),
          model: modelDef.displayName,
        },
        "success",
      )

      await db
        .update(stories)
        .set({
          progress: 60,
          progressMessage: "Structuring chapters...",
          scriptText: script,
        })
        .where(eq(stories.id, storyId))

      await log.narrator(storyId, "Generating chapter breakdown", {})

      // Use Anthropic for chapter parsing as well
      const { text: chaptersJson } = await generateText({
        model: anthropic("claude-sonnet-4-6"),
        prompt: `Given this narrative script, create a JSON array of chapters with titles and approximate timestamps.

SCRIPT:
${script.slice(0, 4000)}

Output a JSON array like this (estimate timestamps based on ~150 words per minute):
[
  {"number": 1, "title": "Introduction", "start_time_seconds": 0, "duration_seconds": 120},
  {"number": 2, "title": "Architecture Overview", "start_time_seconds": 120, "duration_seconds": 180},
  ...
]

Output ONLY valid JSON, no other text:`,
        maxOutputTokens: 1000,
        temperature: 0.3,
      })

      let chapters = []
      try {
        chapters = JSON.parse(chaptersJson.trim())
        console.log("[v0] Chapters parsed:", chapters.length)
        await log.narrator(
          storyId,
          "Chapters structured",
          {
            chapterCount: chapters.length,
          },
          "success",
        )
      } catch {
        console.log("[v0] Chapter parsing failed, using single chapter")
        chapters = [{ number: 1, title: "Full Narrative", start_time_seconds: 0, duration_seconds: targetMinutes * 60 }]
        await log.narrator(storyId, "Using single chapter fallback", {}, "warning")
      }

      await db
        .update(stories)
        .set({
          chapters,
          progress: 70,
          progressMessage: "Script complete. Preparing audio synthesis...",
        })
        .where(eq(stories.id, storyId))

      const elapsedMs = Date.now() - startTime
      console.log("[v0] Elapsed time before audio synthesis:", Math.round(elapsedMs / 1000), "seconds")

      if (elapsedMs > TIMEOUT_WARNING_MS) {
        console.log("[v0] WARNING: Running low on time, may not complete audio synthesis")
        await log.system(
          storyId,
          "Time warning - audio synthesis may be interrupted",
          {
            elapsedSeconds: Math.round(elapsedMs / 1000),
            remainingSeconds: Math.round((300000 - elapsedMs) / 1000),
          },
          "warning",
        )
      }

      // ===== SYNTHESIZER AGENT =====
      await db
        .update(stories)
        .set({
          status: "synthesizing",
          progress: 75,
          progressMessage: "Initializing ElevenLabs...",
        })
        .where(eq(stories.id, storyId))

      const elevenLabsKey = process.env.ELEVENLABS_API_KEY
      console.log("[v0] ElevenLabs key available:", !!elevenLabsKey)

      if (elevenLabsKey) {
        const voiceId = story.voiceId || "21m00Tcm4TlvDq8ikWAM"

        const storedConfig = storedModelConf.ttsConfig || {}
        const ttsModelId = storedConfig.ttsModelId || "eleven_flash_v2_5"
        const ttsOutputFormat = storedConfig.outputFormat || "mp3_44100_128"
        const ttsVoiceSettings = {
          stability: storedConfig.stability ?? (story.narrativeStyle === "fiction" ? 0.35 : 0.5),
          similarity_boost: storedConfig.similarityBoost ?? 0.8,
          style: storedConfig.style ?? (story.narrativeStyle === "fiction" ? 0.15 : 0),
          use_speaker_boost: storedConfig.useSpeakerBoost ?? true,
        }
        const ttsLanguage = storedConfig.language || undefined

        const modelId = ttsModelId
        const maxChunkSize = 10000

        await log.synthesizer(storyId, "Initializing ElevenLabs voice synthesis", {
          voice: voiceId,
          model: modelId,
          outputFormat: ttsOutputFormat,
          voiceSettings: ttsVoiceSettings,
          language: ttsLanguage,
          totalScriptLength: script.length,
        })

        const scriptChunks = splitTextIntoChunks(script, maxChunkSize)
        console.log("[v0] Script split into", scriptChunks.length, "chunks using model:", modelId)

        await log.synthesizer(storyId, "Script chunked for synthesis", {
          totalLength: script.length,
          chunks: scriptChunks.length,
          chunkLengths: scriptChunks.map((c) => c.length),
        })

        await db
          .update(stories)
          .set({
            progress: 78,
            progressMessage: `Generating audio (0/${scriptChunks.length} chunks)...`,
          })
          .where(eq(stories.id, storyId))

        try {
          const audioBuffers: ArrayBuffer[] = []
          const chapterAudioUrls: string[] = []

          for (let i = 0; i < scriptChunks.length; i++) {
            const chunk = scriptChunks[i]
            const chunkNum = i + 1

            const chunkElapsed = Date.now() - startTime
            if (chunkElapsed > 270000) {
              // 4.5 minutes - leave buffer for upload
              console.log("[v0] TIMEOUT WARNING: Stopping audio generation to save progress")
              await log.synthesizer(
                storyId,
                "Timeout - saving partial progress",
                {
                  completedChunks: i,
                  totalChunks: scriptChunks.length,
                },
                "warning",
              )

              // Save what we have so far
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
                  .where(eq(stories.id, storyId))

                return Response.json({
                  success: true,
                  partial: true,
                  audioUrl: chapterAudioUrls[0],
                  audioChunks: chapterAudioUrls,
                  completedChunks: chapterAudioUrls.length,
                  totalChunks: scriptChunks.length,
                })
              }
              break
            }

            console.log(`[v0] Processing chunk ${chunkNum}/${scriptChunks.length}, length: ${chunk.length}`)

            await log.synthesizer(storyId, `Processing chunk ${chunkNum}/${scriptChunks.length}`, {
              chunkLength: chunk.length,
              preview: chunk.slice(0, 100) + "...",
            })

            await db
              .update(stories)
              .set({
                progress: 78 + Math.round((i / scriptChunks.length) * 15),
                progressMessage: `Generating audio (${chunkNum}/${scriptChunks.length} chunks)...`,
              })
              .where(eq(stories.id, storyId))

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
              await log.synthesizer(
                storyId,
                `Chunk ${chunkNum} failed`,
                {
                  status: audioResponse.status,
                  error: errorText.slice(0, 200),
                },
                "error",
              )
              throw new Error(`ElevenLabs API error on chunk ${chunkNum}: ${errorText}`)
            }

            // Get request ID for continuity tracking
            const requestId = audioResponse.headers.get("request-id")
            if (requestId) {
              // requestIds.push(requestId)
            }

            const buffer = await audioResponse.arrayBuffer()
            audioBuffers.push(buffer)

            console.log(`[v0] Chunk ${chunkNum} complete, size: ${buffer.byteLength} bytes`)

            await log.synthesizer(
              storyId,
              `Chunk ${chunkNum} complete`,
              {
                sizeBytes: buffer.byteLength,
                // requestId,
              },
              "success",
            )

            console.log(`[v0] Uploading chunk ${chunkNum}, size: ${buffer.byteLength} bytes`)

            try {
              const audioMimeType = ttsOutputFormat.startsWith("mp3") ? "audio/mpeg"
                : ttsOutputFormat.startsWith("pcm") ? "audio/pcm"
                : ttsOutputFormat.startsWith("ulaw") ? "audio/basic"
                : "audio/mpeg"
              const chunkUrl = await uploadAudioChunk(buffer, storyId, chunkNum, audioMimeType)
              chapterAudioUrls.push(chunkUrl)
              console.log(`[v0] Chunk ${chunkNum} uploaded: ${chunkUrl}`)
            } catch (uploadError) {
              const errMsg = uploadError instanceof Error ? uploadError.message : String(uploadError)
              console.error(`[v0] Chunk ${chunkNum} upload error:`, uploadError)
              await log.synthesizer(
                storyId,
                `Chunk ${chunkNum} upload failed`,
                { error: errMsg },
                "error",
              )
              throw new Error(`Failed to upload chunk ${chunkNum}: ${errMsg}`)
            }
          }

          const totalBytes = audioBuffers.reduce((sum, b) => sum + b.byteLength, 0)
          console.log("[v0] All chunks synthesized and uploaded, total bytes:", totalBytes)

          await log.synthesizer(
            storyId,
            "All audio chunks uploaded",
            {
              totalChunks: chapterAudioUrls.length,
              totalBytes,
            },
            "success",
          )

          await db
            .update(stories)
            .set({
              progress: 95,
              progressMessage: "Finalizing tale...",
            })
            .where(eq(stories.id, storyId))

          const mainAudioUrl = chapterAudioUrls[0]

          // Estimate duration: ~2.5 words per second at normal speaking pace
          const estimatedDuration = Math.round(actualWords / 2.5)

          const updatedChapters = chapters.map(
            (
              ch: { number: number; title: string; start_time_seconds: number; duration_seconds: number },
              idx: number,
            ) => ({
              ...ch,
              audio_url: chapterAudioUrls[idx] || chapterAudioUrls[chapterAudioUrls.length - 1],
            }),
          )

          await log.synthesizer(
            storyId,
            "Audio processing complete",
            {
              mainUrl: mainAudioUrl,
              chunkCount: chapterAudioUrls.length,
              durationSeconds: estimatedDuration,
            },
            "success",
          )

          await log.system(
            storyId,
            "Tale generation complete!",
            {
              totalDuration: estimatedDuration,
              chapters: updatedChapters.length,
            },
            "success",
          )

          try {
            await db
              .update(stories)
              .set({
                audioUrl: mainAudioUrl,
                audioChunks: chapterAudioUrls,
                chapters: updatedChapters,
                actualDurationSeconds: estimatedDuration,
                status: "completed",
                progress: 100,
                progressMessage: "Tale generated successfully!",
                processingCompletedAt: new Date(),
              })
              .where(eq(stories.id, storyId))
          } catch (finalUpdateError) {
            console.error("[v0] Final update error:", finalUpdateError)
          }

          console.log("[v0] Tale generation complete!")

          return Response.json({
            success: true,
            audioUrl: mainAudioUrl,
            audioChunks: chapterAudioUrls,
            duration: estimatedDuration,
          })
        } catch (audioError) {
          console.error("[v0] Audio generation error:", audioError)
          await log.synthesizer(
            storyId,
            "Audio generation failed",
            {
              error: audioError instanceof Error ? audioError.message : "Unknown error",
            },
            "error",
          )

          // Mark as failed, not completed
          await db
            .update(stories)
            .set({
              status: "failed",
              errorMessage: audioError instanceof Error ? audioError.message : "Audio generation failed",
              processingCompletedAt: new Date(),
            })
            .where(eq(stories.id, storyId))

          return Response.json({ error: "Audio generation failed" }, { status: 500 })
        }
      } else {
        console.log("[v0] No ElevenLabs key, completing without audio")
        await log.synthesizer(storyId, "ElevenLabs API key not configured", {}, "warning")

        // Fallback: complete without audio
        await log.system(storyId, "Completing with script only", {}, "warning")

        await db
          .update(stories)
          .set({
            status: "completed",
            progress: 100,
            progressMessage: "Script generated (audio pending)",
            processingCompletedAt: new Date(),
          })
          .where(eq(stories.id, storyId))

        return Response.json({
          success: true,
          message: "Script generated successfully",
          hasAudio: false,
        })
      }
    } catch (error) {
      console.error("[v0] Generation failed:", error)
      await log.system(
        storyId,
        "Generation failed",
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "error",
      )

      await db
        .update(stories)
        .set({
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          processingCompletedAt: new Date(),
        })
        .where(eq(stories.id, storyId))

      return Response.json({ error: "Generation failed" }, { status: 500 })
    }
  } catch (outerError) {
    console.error("[v0] ====== FATAL UNHANDLED ERROR ======")
    console.error("[v0] Error:", outerError)
    console.error("[v0] Stack:", outerError instanceof Error ? outerError.stack : "No stack")
    return Response.json(
      {
        error: "Fatal generation error",
        details: outerError instanceof Error ? outerError.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
