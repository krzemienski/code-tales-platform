import { NextRequest, NextResponse } from "next/server";
import * as client from "openid-client";
import crypto from "crypto";

const ISSUER = new URL(process.env.REPLIT_OIDC_ISSUER || "https://replit.com/oidc");
const CLIENT_ID = process.env.REPLIT_OIDC_CLIENT_ID!;
const CLIENT_SECRET = process.env.REPLIT_OIDC_CLIENT_SECRET!;

export async function GET(request: NextRequest) {
  const returnUrl = request.nextUrl.searchParams.get("return") || "/dashboard";
  const host = request.headers.get("host") || "codetales.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/callback`;

  try {
    const config = await client.discovery(ISSUER, CLIENT_ID, CLIENT_SECRET);

    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
    const state = crypto.randomBytes(16).toString("hex");

    const authorizationUrl = client.buildAuthorizationUrl(config, {
      redirect_uri: redirectUri,
      scope: "openid profile email",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state,
    });

    const response = NextResponse.redirect(authorizationUrl.toString());

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 10,
      path: "/",
    };
    response.cookies.set("oidc_code_verifier", codeVerifier, cookieOpts);
    response.cookies.set("oidc_state", state, cookieOpts);
    response.cookies.set("auth_return_url", returnUrl, cookieOpts);

    return response;
  } catch (error) {
    console.error("OIDC login init error:", error);
    return NextResponse.redirect(new URL("/auth/login?error=auth_init_failed", request.url));
  }
}
