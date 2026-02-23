// lib/api.ts (build-safe)
export const VLR_BASE = "https://vlrggapi.vercel.app"; // fonte pública (axsddlr)

async function safeJson(url: string) {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "KillzoneHUB/1.0" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getRankings(region: string) {
  return safeJson(`${VLR_BASE}/rankings?region=${encodeURIComponent(region)}`);
}

export async function getLiveMatches() {
  return safeJson(`${VLR_BASE}/match?q=live`);
}

export async function getUpcomingMatches() {
  return safeJson(`${VLR_BASE}/match?q=upcoming`);
}

export async function getEvents() {
  // alguns builds expõem /events, outros /event
  const candidates = [`${VLR_BASE}/events`, `${VLR_BASE}/event`];
  for (const u of candidates) {
    const j = await safeJson(u);
    if (j) return j;
  }
  return null;
}
