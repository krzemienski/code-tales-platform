"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Profile } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface AuthUser {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
}

interface SettingsFormProps {
  user: AuthUser
  profile: Profile | null
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const router = useRouter()
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : profile?.name || ""
  const [name, setName] = useState(displayName)
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const nameParts = name.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      const res = await fetch("/api/auth/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      })

      if (!res.ok) throw new Error("Failed to save")
      setMessage({ type: "success", text: "Settings saved successfully!" })
      router.refresh()
    } catch {
      setMessage({ type: "error", text: "Failed to save settings. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/"
    } catch {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || ""} disabled className="bg-secondary/50" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-secondary"
            />
          </div>
          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-primary" : "text-destructive"}`}>
              {message.text}
            </p>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your plan and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
            <div>
              <p className="font-medium capitalize">{profile?.subscription_tier || "Free"} Plan</p>
              <p className="text-sm text-muted-foreground">
                {profile?.stories_used_this_month || 0}/{profile?.usage_quota?.stories_per_month || 5} stories this
                month
              </p>
            </div>
            <Button variant="outline" className="bg-transparent">
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50 bg-card">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut} className="bg-transparent">
              {isSigningOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Out
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
