import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db, stories } from "@/lib/db"
import { eq, desc, sql, and, gte } from "drizzle-orm"

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userStories = await db
      .select({
        id: stories.id,
        title: stories.title,
        playCount: stories.playCount,
        actualDurationSeconds: stories.actualDurationSeconds,
        createdAt: stories.createdAt,
        status: stories.status,
      })
      .from(stories)
      .where(eq(stories.userId, user.id))

    const totalStories = userStories.length
    const completedStories = userStories.filter(s => s.status === "completed")
    
    const totalPlays = completedStories.reduce((sum, s) => sum + (s.playCount || 0), 0)
    
    const totalListeningTimeSeconds = completedStories.reduce((sum, s) => {
      const duration = s.actualDurationSeconds || 0
      const plays = s.playCount || 0
      return sum + (duration * plays)
    }, 0)

    const mostPopularStory = completedStories.length > 0
      ? completedStories.reduce((max, s) => 
          (s.playCount || 0) > (max.playCount || 0) ? s : max
        , completedStories[0])
      : null

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const playsOverTimeData: { date: string; plays: number }[] = []
    const dateMap = new Map<string, number>()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      dateMap.set(dateStr, 0)
    }

    completedStories.forEach(story => {
      if (story.createdAt) {
        const createdDate = new Date(story.createdAt)
        if (createdDate >= thirtyDaysAgo) {
          const dateStr = createdDate.toISOString().split("T")[0]
          if (dateMap.has(dateStr)) {
            dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + (story.playCount || 0))
          }
        }
      }
    })

    dateMap.forEach((plays, date) => {
      playsOverTimeData.push({ date, plays })
    })

    playsOverTimeData.sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      totalStories,
      completedStories: completedStories.length,
      totalPlays,
      totalListeningTimeSeconds,
      mostPopularStory: mostPopularStory ? {
        id: mostPopularStory.id,
        title: mostPopularStory.title,
        playCount: mostPopularStory.playCount,
        durationSeconds: mostPopularStory.actualDurationSeconds,
      } : null,
      playsOverTime: playsOverTimeData,
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
