"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Search, Loader2, Mic, Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VoicePreviewButton } from "@/components/voice-preview-button"
import { cn } from "@/lib/utils"

interface VoiceLabels {
  gender?: string
  accent?: string
  age?: string
  language?: string
  [key: string]: string | undefined
}

interface Voice {
  id: string
  name: string
  category?: string
  description?: string
  previewUrl?: string
  labels?: VoiceLabels
}

interface VoiceFilters {
  categories: string[]
  genders: string[]
  accents: string[]
  languages: string[]
}

interface VoicesApiResponse {
  voices: Voice[]
  filters: VoiceFilters
  totalCount: number
  filteredCount: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

interface VoiceBrowserProps {
  selectedVoiceId: string
  onVoiceSelect: (voiceId: string) => void
  label?: string
  className?: string
}

const CATEGORY_TABS = ["premade", "community", "cloned", "generated", "professional"] as const
const PAGE_SIZE = 50

export function VoiceBrowser({ selectedVoiceId, onVoiceSelect, label = "Voice", className }: VoiceBrowserProps) {
  const [voices, setVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [genders, setGenders] = useState<string[]>([])
  const [accents, setAccents] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filteredCount, setFilteredCount] = useState(0)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 300)
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [search])

  const fetchVoices = useCallback(async (page: number) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      })
      if (debouncedSearch) params.set("search", debouncedSearch)
      if (selectedCategory) params.set("category", selectedCategory)
      if (selectedGender) params.set("gender", selectedGender)
      if (selectedAccent) params.set("accent", selectedAccent)
      if (selectedLanguage) params.set("language", selectedLanguage)

      const response = await fetch(`/api/voices?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch voices")
      const data: VoicesApiResponse = await response.json()
      setVoices(data.voices || [])
      setCategories(data.filters?.categories || [])
      setGenders(data.filters?.genders || [])
      setAccents(data.filters?.accents || [])
      setLanguages(data.filters?.languages || [])
      setTotalPages(data.totalPages || 1)
      setTotalCount(data.totalCount || 0)
      setFilteredCount(data.filteredCount || 0)
      setCurrentPage(data.page || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load voices")
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedCategory, selectedGender, selectedAccent, selectedLanguage])

  useEffect(() => {
    fetchVoices(currentPage)
  }, [fetchVoices, currentPage])

  const selectedVoice = useMemo(() =>
    voices.find(v => v.id === selectedVoiceId),
    [voices, selectedVoiceId]
  )

  const clearFilters = useCallback(() => {
    setSearch("")
    setDebouncedSearch("")
    setSelectedCategory(null)
    setSelectedGender(null)
    setSelectedAccent(null)
    setSelectedLanguage(null)
    setCurrentPage(1)
  }, [])

  const handleCategoryChange = useCallback((cat: string | null) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }, [])

  const handleGenderChange = useCallback((g: string | null) => {
    setSelectedGender(g)
    setCurrentPage(1)
  }, [])

  const handleAccentChange = useCallback((a: string | null) => {
    setSelectedAccent(a)
    setCurrentPage(1)
  }, [])

  const handleLanguageChange = useCallback((lang: string | null) => {
    setSelectedLanguage(lang)
    setCurrentPage(1)
  }, [])

  const hasActiveFilters = search || selectedCategory || selectedGender || selectedAccent || selectedLanguage

  if (error && voices.length === 0) {
    return (
      <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">{label}</Label>
        </div>
      )}

      {selectedVoice && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedVoice.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {selectedVoice.category && (
                <span className="text-[10px] text-muted-foreground capitalize">{selectedVoice.category}</span>
              )}
              {selectedVoice.labels?.gender && (
                <span className="text-[10px] text-muted-foreground capitalize">{selectedVoice.labels.gender}</span>
              )}
              {selectedVoice.labels?.accent && (
                <span className="text-[10px] text-muted-foreground capitalize">{selectedVoice.labels.accent}</span>
              )}
              {selectedVoice.labels?.language && (
                <span className="text-[10px] text-muted-foreground capitalize">{selectedVoice.labels.language}</span>
              )}
            </div>
          </div>
          <VoicePreviewButton voiceId={selectedVoiceId} />
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, accent, or language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm bg-secondary/50"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="h-8 px-2"
        >
          <Filter className="h-3.5 w-3.5" />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer text-[10px]"
          onClick={() => handleCategoryChange(null)}
        >
          All
        </Badge>
        {CATEGORY_TABS.filter(tab => categories.includes(tab)).map(tab => (
          <Badge
            key={tab}
            variant={selectedCategory === tab ? "default" : "outline"}
            className={cn(
              "cursor-pointer text-[10px] capitalize",
              selectedCategory === tab && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleCategoryChange(selectedCategory === tab ? null : tab)}
          >
            {tab}
          </Badge>
        ))}
        {categories.filter(c => !CATEGORY_TABS.includes(c as typeof CATEGORY_TABS[number])).map(cat => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className={cn(
              "cursor-pointer text-[10px] capitalize",
              selectedCategory === cat && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleCategoryChange(selectedCategory === cat ? null : cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {showFilters && (
        <div className="space-y-2 p-3 rounded-lg bg-secondary/30 border border-border">
          {genders.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Gender</span>
              <div className="flex flex-wrap gap-1">
                {genders.map(g => (
                  <Badge
                    key={g}
                    variant={selectedGender === g ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer text-[10px] capitalize",
                      selectedGender === g && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleGenderChange(selectedGender === g ? null : g)}
                  >
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {accents.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Accent</span>
              <div className="flex flex-wrap gap-1">
                {accents.sort().map(a => (
                  <Badge
                    key={a}
                    variant={selectedAccent === a ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer text-[10px] capitalize",
                      selectedAccent === a && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleAccentChange(selectedAccent === a ? null : a)}
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Language</span>
              <div className="flex flex-wrap gap-1">
                {languages.sort().map(l => (
                  <Badge
                    key={l}
                    variant={selectedLanguage === l ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer text-[10px] uppercase",
                      selectedLanguage === l && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleLanguageChange(selectedLanguage === l ? null : l)}
                  >
                    {l}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading voices...</span>
          </div>
        ) : voices.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No voices found{hasActiveFilters ? " matching filters" : ""}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {voices.map(voice => (
              <button
                key={voice.id}
                onClick={() => onVoiceSelect(voice.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 text-left hover:bg-secondary/50 transition-colors",
                  voice.id === selectedVoiceId && "bg-primary/5"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm truncate",
                    voice.id === selectedVoiceId ? "font-medium text-primary" : "text-foreground"
                  )}>
                    {voice.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {voice.category && (
                      <span className="text-[10px] text-muted-foreground capitalize">{voice.category}</span>
                    )}
                    {voice.labels?.gender && (
                      <span className="text-[10px] text-muted-foreground capitalize">· {voice.labels.gender}</span>
                    )}
                    {voice.labels?.accent && (
                      <span className="text-[10px] text-muted-foreground capitalize">· {voice.labels.accent}</span>
                    )}
                    {voice.labels?.age && (
                      <span className="text-[10px] text-muted-foreground capitalize">· {voice.labels.age}</span>
                    )}
                  </div>
                </div>
                <VoicePreviewButton voiceId={voice.id} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {filteredCount} of {totalCount} voices
          {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
