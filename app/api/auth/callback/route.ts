import { NextRequest, NextResponse } from "next/server";
import * as client from "openid-client";
import { createSession, setSessionCookie } from "@/lib/auth";

const ISSUER = new URL(process.env.REPLIT_OIDC_ISSUER || "https://replit.com/oidc");
const CLIENT_ID = process.env.REPLIT_OIDC_CLIENT_ID!;
const CLIENT_SECRET = process.env.REPLIT_OIDC_CLIENT_SECRET!;

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "codetales.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/callback`;

  const returnUrl = request.cookies.get("auth_return_url")?.value || "/dashboard";
  const storedState = request.cookies.get("oidc_state")?.value;
  const codeVerifier = request.cookies.get("oidc_code_verifier")?.value;

  try {
    if (!storedState || !codeVerifier) {
      console.error("Auth callback: missing state or code_verifier cookie");
      return NextResponse.redirect(new URL("/auth/login?error=missing_state", request.url));
    }

    const config = await client.discovery(ISSUER, CLIENT_ID, CLIENT_SECRET);

    const currentUrl = new URL(request.url);
    const tokens = await client.authorizationCodeGrant(
      config,
      currentUrl,
      { pkceCodeVerifier: codeVerifier, expectedState: storedState },
      { redirect_uri: redirectUri }
    );

    const claims = tokens.claims();
    if (!claims) {
      console.error("Auth callback: no claims in token response");
      return NextResponse.redirect(new URL("/auth/login?error=no_claims", request.url));
    }

    const userInfo = await client.fetchUserInfo(config, tokens.access_token!, claims.sub as string);

    const info = userInfo as Record<string, unknown>;
    const userId = String(info.sub || claims.sub);
    const userName = String(info.username || info.name || info.email || userId);
    const profileImageUrl = String(info.profile_image_url || "");
    const email = String(info.email || "");

    const sessionToken = await createSession({
      id: userId,
      name: userName,
      email: email || undefined,
      image: profileImageUrl || undefined,
    });

    await setSessionCookie(sessionToken);

    const response = NextResponse.redirect(new URL(returnUrl, request.url));
    response.cookies.delete("auth_return_url");
    response.cookies.delete("oidc_state");
    response.cookies.delete("oidc_code_verifier");

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    const msg = error instanceof Error ? error.message : "unknown";
    return NextResponse.redirect(
      new URL(`/auth/login?error=callback_failed&detail=${encodeURIComponent(msg)}`, request.url)
    );
  }
}
