import { NextResponse } from "next/server"
import { listVoices, RECOMMENDED_VOICE_PAIRS } from "@/lib/generation/elevenlabs-studio"

export async function GET() {
  try {
    const { voices } = await listVoices()
    
    const categorizedVoices = {
      recommended: Object.entries(RECOMMENDED_VOICE_PAIRS).map(([key, pair]) => ({
        id: key,
        name: pair.description,
        host: pair.host,
        guest: pair.guest,
      })),
      all: voices.map(v => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
        description: v.description,
        previewUrl: v.preview_url,
        labels: v.labels,
      })),
    }

    return NextResponse.json(categorizedVoices)
  } catch (error) {
    console.error("[voices] Error:", error)
    
    return NextResponse.json({
      recommended: Object.entries(RECOMMENDED_VOICE_PAIRS).map(([key, pair]) => ({
        id: key,
        name: pair.description,
        host: pair.host,
        guest: pair.guest,
      })),
      all: [],
      error: error instanceof Error ? error.message : "Failed to fetch voices",
    })
  }
}
