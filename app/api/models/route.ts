import { NextResponse } from "next/server"
import { listModels, QUALITY_PRESETS, DURATION_PRESETS } from "@/lib/generation/elevenlabs-studio"

export async function GET() {
  try {
    const models = await listModels()
    
    const ttsModels = models.filter(m => m.can_do_text_to_speech)

    return NextResponse.json({
      models: ttsModels.map(m => ({
        id: m.model_id,
        name: m.name,
        description: m.description,
        languages: m.languages,
      })),
      qualityPresets: Object.values(QUALITY_PRESETS),
      durationPresets: Object.values(DURATION_PRESETS),
      recommended: {
        podcast: "eleven_flash_v2_5",
        audiobook: "eleven_multilingual_v2",
        realtime: "eleven_turbo_v2_5",
      },
    })
  } catch (error) {
    console.error("[models] Error:", error)
    
    return NextResponse.json({
      models: [
        { id: "eleven_flash_v2_5", name: "Flash v2.5", description: "Fast, high quality" },
        { id: "eleven_turbo_v2_5", name: "Turbo v2.5", description: "Ultra low latency" },
        { id: "eleven_multilingual_v2", name: "Multilingual v2", description: "High quality, 29 languages" },
      ],
      qualityPresets: Object.values(QUALITY_PRESETS),
      durationPresets: Object.values(DURATION_PRESETS),
      recommended: {
        podcast: "eleven_flash_v2_5",
        audiobook: "eleven_multilingual_v2",
        realtime: "eleven_turbo_v2_5",
      },
      error: error instanceof Error ? error.message : "Failed to fetch models",
    })
  }
}
