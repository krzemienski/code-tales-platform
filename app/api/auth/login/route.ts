import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const returnUrl = request.nextUrl.searchParams.get("return") || "/dashboard";
  const baseUrl = `${request.nextUrl.protocol}//${request.headers.get("host")}`;
  
  const authUrl = new URL("https://replit.com/auth_with_repl_site");
  authUrl.searchParams.set("domain", request.headers.get("host") || "");
  
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set("auth_return_url", returnUrl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5, // 5 minutes
    path: "/",
  });
  
  return response;
}
