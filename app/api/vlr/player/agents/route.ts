import { NextResponse } from "next/server";
import { fetchPlayerAgents, resolveVlrPlayerUrlBySearch, type Timespan } from "@/lib/vlrScraper";

// Use Node runtime for cheerio compatibility
export const runtime = "nodejs";

const inMemoryCache = new Map<string, { expires: number; value: any }>();

function getCache(key: string) {
  const v = inMemoryCache.get(key);
  if (!v) return null;
  if (Date.now() > v.expires) {
    inMemoryCache.delete(key);
    return null;
  }
  return v.value;
}

function setCache(key: string, value: any, ttlMs: number) {
  inMemoryCache.set(key, { value, expires: Date.now() + ttlMs });
}

function asTimespan(v: string | null): Timespan {
  if (v === "60d" || v === "90d" || v === "all") return v;
  return "30d";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const player = (searchParams.get("player") ?? "").trim();
  const org = (searchParams.get("org") ?? "").trim();
  const timespan = asTimespan(searchParams.get("timespan"));

  if (!player) {
    return NextResponse.json({ error: "Missing ?player=" }, { status: 400 });
  }

  const key = `vlr:agents:${player.toLowerCase()}|${org.toLowerCase()}|${timespan}`;
  const cached = getCache(key);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  // Controlled scraping: cache 6h, and keep response small
  try {
    const url = await resolveVlrPlayerUrlBySearch(player, org || undefined);
    if (!url) {
      return NextResponse.json({ error: "Player not found on VLR", player, org, timespan }, { status: 404 });
    }

    const result = await fetchPlayerAgents(url, timespan);

    // Reduce payload
    const payload = {
      player,
      org,
      timespan,
      vlrPlayerUrl: result.vlrPlayerUrl,
      displayName: result.displayName,
      agents: result.agents
        .sort((a, b) => (b.useCount ?? 0) - (a.useCount ?? 0))
        .slice(0, 10),
    };

    setCache(key, payload, 6 * 60 * 60 * 1000);
    return NextResponse.json({ ...payload, cached: false });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to scrape VLR", message: e?.message ?? String(e) },
      { status: 502 }
    );
  }
}
