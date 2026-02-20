import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { requiredEnv } from "@/lib/env";

export type SessionUser = {
  discordId: string;
  username: string;
  avatarUrl?: string;
};

export const SESSION_COOKIE = "session";

function sessionSecret(): Uint8Array {
  const secret = requiredEnv("SESSION_SECRET");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionUser): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(sessionSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function readSession(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
