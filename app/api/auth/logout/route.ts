import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "edge";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set({ name: SESSION_COOKIE, value: "", maxAge: 0, path: "/" });
  return res;
}
