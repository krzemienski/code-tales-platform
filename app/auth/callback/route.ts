import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get("redirect_to") || "/dashboard"

  return NextResponse.redirect(`${origin}/api/auth/callback${requestUrl.search}`)
}
