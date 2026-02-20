import { NextResponse } from "next/server";
import { requiredEnv } from "@/lib/env";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "edge";

async function fetchToken(code: string) {
  const clientId = requiredEnv("DISCORD_CLIENT_ID");
  const clientSecret = requiredEnv("DISCORD_CLIENT_SECRET");
  const redirectUri = requiredEnv("DISCORD_REDIRECT_URI");

  const body = new URLSearchParams();
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUri);

  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Failed to exchange code");
  return await res.json() as any;
}

async function fetchMe(accessToken: string) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json() as any;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(new URL("/login?error=missing_code", req.url));

  const token = await fetchToken(code);
  const me = await fetchMe(token.access_token);

  const avatarUrl = me.avatar ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png` : undefined;

  const sessionToken = await createSessionToken({
    discordId: me.id,
    username: `${me.username}`,
    avatarUrl,
  });

  const res = NextResponse.redirect(new URL("/perfil", req.url));
  res.cookies.set({
    name: SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  res.cookies.set({ name: "oauth_state", value: "", maxAge: 0, path: "/" });
  return res;
}
