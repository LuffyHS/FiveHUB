import { NextResponse } from "next/server";
import { getRankings } from "@/lib/vlrggapi";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") ?? "na";

  const data = await getRankings(region);
  const rankings = data?.data?.segments ?? [];

  return NextResponse.json({ region, rankings }, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" }
  });
}
