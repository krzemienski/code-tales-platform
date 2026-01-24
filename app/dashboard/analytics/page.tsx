"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ParallaxBackground } from "@/components/parallax-background"
import { BarChart3, BookOpen, Headphones, Clock, TrendingUp, Crown, ArrowLeft } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface AnalyticsData {
  totalStories: number
  completedStories: number
  totalPlays: number
  totalListeningTimeSeconds: number
  mostPopularStory: {
    id: string
    title: string
    playCount: number
    durationSeconds: number
  } | null
  playsOverTime: { date: string; plays: number }[]
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0 min"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} min`
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics")
        if (!response.ok) {
          throw new Error("Failed to fetch analytics")
        }
        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <ParallaxBackground />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background relative">
        <ParallaxBackground />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-destructive">Error: {error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ParallaxBackground />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">Track your story engagement and performance</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Stories</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics?.totalStories || 0}</div>
              <p className="text-xs text-muted-foreground">{analytics?.completedStories || 0} completed</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Plays</CardTitle>
              <Headphones className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics?.totalPlays || 0}</div>
              <p className="text-xs text-muted-foreground">Across all stories</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Listening Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatDuration(analytics?.totalListeningTimeSeconds || 0)}</div>
              <p className="text-xs text-muted-foreground">Total listening time</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Plays/Story</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {analytics?.completedStories ? Math.round((analytics.totalPlays / analytics.completedStories) * 10) / 10 : 0}
              </div>
              <p className="text-xs text-muted-foreground">Per completed story</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2 bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Plays Over Time
              </CardTitle>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {analytics?.playsOverTime && analytics.playsOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.playsOverTime}>
                      <defs>
                        <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={formatShortDate}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))"
                        }}
                        labelFormatter={(label) => formatShortDate(label as string)}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="plays" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorPlays)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No play data available yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Most Popular Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.mostPopularStory ? (
                <div className="space-y-4">
                  <div>
                    <Link 
                      href={`/story/${analytics.mostPopularStory.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {analytics.mostPopularStory.title}
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Plays</span>
                      <span className="font-medium text-foreground">{analytics.mostPopularStory.playCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{formatDuration(analytics.mostPopularStory.durationSeconds)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No completed stories yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
