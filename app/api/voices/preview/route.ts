import { NextRequest, NextResponse } from "next/server"

const audioCache = new Map<string, ArrayBuffer>()

const DEFAULT_SAMPLE_TEXT = "Welcome to Code Tales. Let me tell you a story about your code."

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const voiceId = searchParams.get("voiceId")
  const text = searchParams.get("text") || DEFAULT_SAMPLE_TEXT

  if (!voiceId) {
    return NextResponse.json({ error: "voiceId is required" }, { status: 400 })
  }

  const elevenLabsKey = process.env.ELEVENLABS_API_KEY
  if (!elevenLabsKey) {
    return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 503 })
  }

  const cacheKey = `${voiceId}:${text}`
  const cachedAudio = audioCache.get(cacheKey)

  if (cachedAudio) {
    return new NextResponse(cachedAudio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    })
  }

  try {
    const audioResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenLabsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text()
      console.error("[VoicePreview] ElevenLabs error:", errorText)
      return NextResponse.json(
        { error: "Failed to generate audio preview" },
        { status: audioResponse.status }
      )
    }

    const audioBuffer = await audioResponse.arrayBuffer()
    audioCache.set(cacheKey, audioBuffer)

    if (audioCache.size > 100) {
      const firstKey = audioCache.keys().next().value
      if (firstKey) audioCache.delete(firstKey)
    }

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("[VoicePreview] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function HEAD() {
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY
  if (!elevenLabsKey) {
    return new NextResponse(null, { status: 503 })
  }
  return new NextResponse(null, { status: 200 })
}
