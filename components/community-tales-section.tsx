"use client"

import { useState, useMemo } from "react"
import { Code, Search, Mic, Film, Sparkles, GraduationCap, Cpu, Laugh } from "lucide-react"
import { ChronicleCard } from "@/components/chronicle-card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Tale {
  id: string
  title: string
  narrative_style: string
  actual_duration_seconds?: number | null
  created_at?: string
  play_count?: number | null
  audio_url?: string | null
  audio_chunks?: string[] | null
  code_repositories?: {
    repo_name: string
    repo_owner: string
    primary_language?: string | null
    stars_count?: number | null
    description?: string | null
  } | null
}

interface CommunityTalesSectionProps {
  tales: Tale[]
}

const NARRATIVE_STYLES = [
  { id: "all", label: "All", icon: null, color: "text-foreground", bgColor: "bg-secondary" },
  { id: "fiction", label: "Fiction", icon: <Sparkles className="h-3.5 w-3.5" />, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  { id: "documentary", label: "Documentary", icon: <Film className="h-3.5 w-3.5" />, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  { id: "tutorial", label: "Tutorial", icon: <GraduationCap className="h-3.5 w-3.5" />, color: "text-green-400", bgColor: "bg-green-500/20" },
  { id: "technical", label: "Technical", icon: <Cpu className="h-3.5 w-3.5" />, color: "text-red-400", bgColor: "bg-red-500/20" },
  { id: "comedy", label: "Comedy", icon: <Laugh className="h-3.5 w-3.5" />, color: "text-pink-400", bgColor: "bg-pink-500/20" },
  { id: "podcast", label: "Podcast", icon: <Mic className="h-3.5 w-3.5" />, color: "text-purple-400", bgColor: "bg-purple-500/20" },
]

export function CommunityTalesSection({ tales }: CommunityTalesSectionProps) {
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTales = useMemo(() => {
    let result = tales

    if (selectedStyle !== "all") {
      result = result.filter(
        (tale) => tale.narrative_style?.toLowerCase() === selectedStyle.toLowerCase()
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((tale) => {
        const titleMatch = tale.title?.toLowerCase().includes(query)
        const repoNameMatch = tale.code_repositories?.repo_name?.toLowerCase().includes(query)
        const repoOwnerMatch = tale.code_repositories?.repo_owner?.toLowerCase().includes(query)
        return titleMatch || repoNameMatch || repoOwnerMatch
      })
    }

    return result
  }, [tales, selectedStyle, searchQuery])

  const styleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tales.length }
    tales.forEach((tale) => {
      const style = tale.narrative_style?.toLowerCase() || "documentary"
      counts[style] = (counts[style] || 0) + 1
    })
    return counts
  }, [tales])

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or repository name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-border"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {NARRATIVE_STYLES.map((style) => {
            const count = styleCounts[style.id] || 0
            const isSelected = selectedStyle === style.id
            
            if (style.id !== "all" && count === 0) return null

            return (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  isSelected
                    ? `${style.bgColor} ${style.color} ring-1 ring-current`
                    : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card border border-border"
                )}
              >
                {style.icon}
                <span>{style.label}</span>
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  isSelected ? "bg-background/20" : "bg-muted"
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filteredTales.length}</span> of{" "}
          <span className="text-foreground font-medium">{tales.length}</span> stories
          {selectedStyle !== "all" && (
            <span className="ml-1">
              in <span className="capitalize">{selectedStyle}</span>
            </span>
          )}
          {searchQuery && (
            <span className="ml-1">
              matching "<span className="text-foreground">{searchQuery}</span>"
            </span>
          )}
        </p>
      </div>

      {filteredTales.length > 0 ? (
        <div className="space-y-4">
          {filteredTales.map((tale) => (
            <ChronicleCard key={tale.id} story={tale} variant="list" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
          {tales.length === 0 ? (
            <p>No tales yet. Be the first to generate one!</p>
          ) : (
            <div>
              <p className="mb-2">No tales match your filters.</p>
              <button
                onClick={() => {
                  setSelectedStyle("all")
                  setSearchQuery("")
                }}
                className="text-primary hover:underline text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
