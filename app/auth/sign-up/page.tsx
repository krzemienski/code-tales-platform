"use client"

import { useEffect } from "react"

export default function SignUpPage() {
  useEffect(() => {
    window.location.href = "/api/auth/login?return=/dashboard"
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <p className="text-muted-foreground">Redirecting to sign in...</p>
    </div>
  )
}
