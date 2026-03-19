import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { DEMO_USER, DEMO_PROFILE } from "@/lib/demo-mode"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get("codetales_demo_mode")?.value === "true"

  if (isDemo) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <DashboardNav user={DEMO_USER as any} profile={DEMO_PROFILE as any} isDemo />
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  const user = await getAuthenticatedUser()

  if (!user) {
    redirect("/auth/login")
  }

  const profile = {
    id: user.id,
    email: user.email,
    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || null,
    avatar_url: user.profileImageUrl,
    subscription_tier: (user.subscriptionTier || "free") as "free" | "pro" | "team",
    preferences: (user.preferences || {}) as Record<string, unknown>,
    usage_quota: (user.usageQuota || { stories_per_month: 5, minutes_per_month: 60 }) as { stories_per_month: number; minutes_per_month: number },
    stories_used_this_month: user.storiesUsedThisMonth || 0,
    minutes_used_this_month: user.minutesUsedThisMonth || 0,
    created_at: user.createdAt?.toISOString() || new Date().toISOString(),
    updated_at: user.updatedAt?.toISOString() || new Date().toISOString(),
  }

  const authUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav user={authUser} profile={profile} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
