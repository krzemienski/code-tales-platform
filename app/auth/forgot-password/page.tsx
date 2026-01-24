"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Info } from "lucide-react"

export default function ForgotPasswordPage() {
  const handleLogin = () => {
    window.location.href = "/api/auth/login?return=/dashboard"
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">No password needed</CardTitle>
            <CardDescription className="text-muted-foreground">
              Code Tales uses Replit authentication, so you don&apos;t need to manage a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Simply sign in with your Replit account to access Code Tales.
              </p>
              <Button onClick={handleLogin} className="w-full">
                Sign in with Replit
              </Button>
              <Link href="/" className="text-center">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
