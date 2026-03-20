import { NextRequest, NextResponse } from "next/server"
import { listVoices, RECOMMENDED_VOICE_PAIRS } from "@/lib/generation/elevenlabs-studio"

interface VoiceLabels {
  gender?: string
  accent?: string
  age?: string
  language?: string
  [key: string]: string | undefined
}

interface CachedVoice {
  id: string
  name: string
  category: string
  description: string
  previewUrl: string
  labels: VoiceLabels
}

interface VoiceCache {
  data: CachedVoice[]
  timestamp: number
}

let voiceCache: VoiceCache | null = null
const CACHE_TTL_MS = 5 * 60 * 1000

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")?.toLowerCase()
    const category = searchParams.get("category")
    const gender = searchParams.get("gender")?.toLowerCase()
    const accent = searchParams.get("accent")?.toLowerCase()
    const language = searchParams.get("language")?.toLowerCase()
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get("pageSize") || "100", 10)))

    let allVoices: CachedVoice[]

    if (voiceCache && Date.now() - voiceCache.timestamp < CACHE_TTL_MS) {
      allVoices = voiceCache.data
    } else {
      const { voices } = await listVoices()
      allVoices = voices.map(v => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
        description: v.description || "",
        previewUrl: v.preview_url || "",
        labels: v.labels as VoiceLabels,
      }))
      voiceCache = { data: allVoices, timestamp: Date.now() }
    }

    let filtered = [...allVoices]

    if (search) {
      filtered = filtered.filter(v =>
        v.name?.toLowerCase().includes(search) ||
        v.description?.toLowerCase().includes(search)
      )
    }

    if (category) {
      filtered = filtered.filter(v => v.category === category)
    }

    if (gender) {
      filtered = filtered.filter(v =>
        v.labels?.gender?.toLowerCase() === gender
      )
    }

    if (accent) {
      filtered = filtered.filter(v =>
        v.labels?.accent?.toLowerCase().includes(accent)
      )
    }

    if (language) {
      filtered = filtered.filter(v =>
        v.labels?.language?.toLowerCase().includes(language)
      )
    }

    const totalFiltered = filtered.length
    const totalPages = Math.ceil(totalFiltered / pageSize)
    const startIndex = (page - 1) * pageSize
    const paginatedVoices = filtered.slice(startIndex, startIndex + pageSize)

    const categories = [...new Set(allVoices.map(v => v.category).filter(Boolean))]
    const genders = [...new Set(allVoices.map(v => v.labels?.gender).filter(Boolean))] as string[]
    const accents = [...new Set(allVoices.map(v => v.labels?.accent).filter(Boolean))] as string[]
    const languages = [...new Set(allVoices.map(v => v.labels?.language).filter(Boolean))] as string[]

    return NextResponse.json({
      recommended: Object.entries(RECOMMENDED_VOICE_PAIRS).map(([key, pair]) => ({
        id: key,
        name: pair.description,
        host: pair.host,
        guest: pair.guest,
      })),
      voices: paginatedVoices,
      totalCount: allVoices.length,
      filteredCount: totalFiltered,
      page,
      pageSize,
      totalPages,
      hasMore: page < totalPages,
      filters: { categories, genders, accents, languages },
    })
  } catch (error) {
    console.error("[voices] Error:", error)

    return NextResponse.json({
      recommended: Object.entries(RECOMMENDED_VOICE_PAIRS).map(([key, pair]) => ({
        id: key,
        name: pair.description,
        host: pair.host,
        guest: pair.guest,
      })),
      voices: [],
      totalCount: 0,
      filteredCount: 0,
      filters: { categories: [], genders: [], accents: [] },
      error: error instanceof Error ? error.message : "Failed to fetch voices",
    })
  }
}
