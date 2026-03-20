import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"

const audioCache = new Map<string, ArrayBuffer>()

const DEFAULT_SAMPLE_TEXT = "Welcome to Code Tales. Let me tell you a story about your code."

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 60_000

const PREVIEW_TEXT_MAX_LENGTH = 200

function checkRateLimit(userId: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, retryAfterMs: 0 }
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterMs: entry.resetAt - now }
  }
  entry.count++
  return { allowed: true, retryAfterMs: 0 }
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { allowed, retryAfterMs } = checkRateLimit(user.id)
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before previewing more voices." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const voiceId = searchParams.get("voiceId")
  const rawText = searchParams.get("text") || DEFAULT_SAMPLE_TEXT
  const text = rawText.slice(0, PREVIEW_TEXT_MAX_LENGTH)

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
