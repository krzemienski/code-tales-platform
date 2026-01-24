import { NextRequest, NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-replit-user-id");
    const userName = headersList.get("x-replit-user-name");
    const userRoles = headersList.get("x-replit-user-roles");
    const userTeams = headersList.get("x-replit-user-teams");
    const userBio = headersList.get("x-replit-user-bio");
    const userUrl = headersList.get("x-replit-user-url");
    const profileImage = headersList.get("x-replit-user-profile-image");

    if (!userId) {
      const returnUrl = request.cookies.get("auth_return_url")?.value || "/dashboard";
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    const sessionToken = await createSession({
      id: userId,
      name: userName || "",
      image: profileImage || undefined,
    });

    await setSessionCookie(sessionToken);

    const returnUrl = request.cookies.get("auth_return_url")?.value || "/dashboard";
    const response = NextResponse.redirect(new URL(returnUrl, request.url));
    response.cookies.delete("auth_return_url");
    
    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
