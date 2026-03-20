import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("replit_auth_session")
    const demoCookie = request.cookies.get("codetales_demo_mode")

    if (demoCookie?.value === "true") {
      return NextResponse.next()
    }

    if (!sessionCookie?.value) {
      const returnPath = pathname + search
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", returnPath)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
