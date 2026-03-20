import { NextResponse } from "next/server"
import { createSession, setSessionCookie } from "@/lib/auth"

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  const sessionToken = await createSession({
    id: "dev-user-e2e-test",
    email: "e2e@codetales.app",
    name: "E2E Test User",
  })

  await setSessionCookie(sessionToken)

  return NextResponse.json({ success: true, message: "Dev session created" })
}
