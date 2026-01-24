import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth"
import { SettingsForm } from "@/components/settings-form"
import { dbClient } from "@/lib/db/client"

export default async function SettingsPage() {
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>

      <div className="space-y-8">
        <SettingsForm user={authUser} profile={profile} />
      </div>
    </div>
  )
}
