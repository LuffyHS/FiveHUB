import { NextResponse } from "next/server";
import { getStats } from "@/lib/vlrggapi";
import { VLRGGAPI_REGION_CODES, type LeagueRegion } from "@/lib/regions";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const league = (searchParams.get("league") ?? "americas") as LeagueRegion;
  const timespan = (searchParams.get("timespan") ?? "30") as "30"|"60"|"90"|"all";

  if (!VLRGGAPI_REGION_CODES[league]) {
    return NextResponse.json({ error: "Invalid league" }, { status: 400 });
  }

  const codes = VLRGGAPI_REGION_CODES[league];
  const chunks = await Promise.all(codes.map((c) => getStats(c, timespan).catch(() => null)));

  const rows: any[] = [];
  for (const ch of chunks) {
    const seg = ch?.data?.segments ?? ch?.data?.data?.segments ?? ch?.data ?? ch?.segments ?? [];
    for (const r of seg) rows.push({ ...r, _region: r.region ?? undefined });
  }

  // de-dupe by player+org
  const seen = new Set<string>();
  const deduped = rows.filter((r) => {
    const key = `${r.player ?? ""}__${r.org ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // basic sort by rating desc
  deduped.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));

  return NextResponse.json({ league, timespan, count: deduped.length, players: deduped }, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    }
  });
}
