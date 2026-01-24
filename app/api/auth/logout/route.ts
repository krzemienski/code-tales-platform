import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await clearSessionCookie();
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export async function POST(request: NextRequest) {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
