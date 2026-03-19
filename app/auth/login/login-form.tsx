"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Logo } from "@/components/logo"
import { setDemoMode } from "@/lib/demo-mode"
import { useCallback } from "react"

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const handleLogin = useCallback(() => {
    const url = `/api/auth/login?return=${encodeURIComponent(redirectTo)}`
    if (window.top && window.top !== window) {
      window.top.location.href = url
    } else {
      window.location.href = url
    }
  }, [redirectTo])

  const handleDemoMode = useCallback(() => {
    setDemoMode(true)
    window.location.href = redirectTo
  }, [redirectTo])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">Sign in to your Code Tales account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <Button onClick={handleLogin} className="w-full">
                Sign in with Replit
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                onClick={handleDemoMode}
              >
                Try Demo Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
