import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "edge";

export async function POST(req: Request) {
  const form = await req.formData();
  const riotId = String(form.get("riotId") ?? "").trim();

  const token = req.headers.get("cookie")?.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))?.[1];
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const session = await verifySessionToken(decodeURIComponent(token));
  if (!session) return NextResponse.redirect(new URL("/login", req.url));

  if (riotId && !riotId.includes("#")) {
    return NextResponse.redirect(new URL("/perfil?error=riotid_format", req.url));
  }

  const key = `riotid:${session.discordId}`;
  if (riotId) await kv.set(key, riotId);
  else await kv.del(key);

  return NextResponse.redirect(new URL("/perfil", req.url));
}
