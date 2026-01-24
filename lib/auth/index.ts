import { cookies } from "next/headers";
import { db, users, authSessions } from "@/lib/db";
import { eq, and, gt } from "drizzle-orm";
import type { User } from "@/lib/db/schema";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "replit_auth_session";
const SESSION_EXPIRY_DAYS = 7;

interface ReplitUser {
  id: string;
  name: string;
  email?: string;
  image?: string;
  teams?: string[];
  roles?: string[];
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return secret;
}

function signToken(sessionId: string): string {
  const secret = getSessionSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(sessionId)
    .digest("hex");
  return `${sessionId}.${signature}`;
}

function verifyToken(token: string): string | null {
  try {
    const [sessionId, providedSignature] = token.split(".");
    if (!sessionId || !providedSignature) {
      return null;
    }
    const secret = getSessionSecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(sessionId)
      .digest("hex");
    
    if (!crypto.timingSafeEqual(
      Buffer.from(providedSignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    )) {
      return null;
    }
    return sessionId;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionToken) {
      return null;
    }

    const sessionId = verifyToken(sessionToken);
    if (!sessionId) {
      return null;
    }

    const now = new Date();
    const [session] = await db
      .select()
      .from(authSessions)
      .where(and(eq(authSessions.id, sessionId), gt(authSessions.expiresAt, now)));

    if (!session) {
      return null;
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.userId));
    return user || null;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

export async function createSession(replitUser: ReplitUser): Promise<string> {
  const [user] = await db
    .insert(users)
    .values({
      id: replitUser.id,
      email: replitUser.email,
      firstName: replitUser.name?.split(" ")[0],
      lastName: replitUser.name?.split(" ").slice(1).join(" "),
      profileImageUrl: replitUser.image,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: replitUser.email,
        firstName: replitUser.name?.split(" ")[0],
        lastName: replitUser.name?.split(" ").slice(1).join(" "),
        profileImageUrl: replitUser.image,
        updatedAt: new Date(),
      },
    })
    .returning();

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(authSessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt,
  });

  return signToken(sessionId);
}

export async function setSessionCookie(sessionToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (sessionToken) {
    const sessionId = verifyToken(sessionToken);
    if (sessionId) {
      await db.delete(authSessions).where(eq(authSessions.id, sessionId));
    }
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
