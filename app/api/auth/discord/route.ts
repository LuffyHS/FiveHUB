import { NextResponse } from "next/server";
import { requiredEnv } from "@/lib/env";

export const runtime = "edge";

export async function GET() {
  const clientId = requiredEnv("DISCORD_CLIENT_ID");
  const redirectUri = requiredEnv("DISCORD_REDIRECT_URI"); // e.g. https://your-domain.vercel.app/api/auth/discord/callback
  const scope = "identify";
  const state = crypto.randomUUID();

  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url.toString());
  res.cookies.set({
    name: "oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 10,
  });
  return res;
}
