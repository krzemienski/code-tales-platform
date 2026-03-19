"use client"

import { useEffect } from "react"

export default function SignUpPage() {
  useEffect(() => {
    const url = "/api/auth/login?return=/dashboard"
    if (window.top && window.top !== window) {
      window.top.location.href = url
    } else {
      window.location.href = url
    }
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <p className="text-muted-foreground">Redirecting to sign in...</p>
    </div>
  )
}
