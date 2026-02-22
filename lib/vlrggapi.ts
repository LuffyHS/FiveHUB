import { fetchJson } from "@/lib/http";

const BASE = "https://vlrggapi.vercel.app";

export async function getNews() {
  return await fetchJson<any>(`${BASE}/v2/news`, { next: { revalidate: 60 * 10 } });
}

export async function getLiveMatches() {
  return await fetchJson<any>(`${BASE}/v2/match?q=live_score`, { next: { revalidate: 30 } });
}

export async function getRankings(region: string) {
  return await fetchJson<any>(`${BASE}/v2/rankings?region=${encodeURIComponent(region)}`, { next: { revalidate: 60 * 60 } });
}

export async function getStats(region: string, timespan: "30"|"60"|"90"|"all") {
  return await fetchJson<any>(`${BASE}/v2/stats?region=${encodeURIComponent(region)}&timespan=${timespan}`, { next: { revalidate: 60 * 30 } });
}


export async function getUpcomingMatches() {
  return await fetchJson<any>(`${BASE}/v2/match?q=upcoming`, { next: { revalidate: 60 * 5 } });
}


export async function getTeamProfile(teamId: string | number) {
  return await fetchJson<any>(`${BASE}/v2/team?id=${encodeURIComponent(String(teamId))}`, { next: { revalidate: 60 * 60 } });
}

export async function getTeamMatches(teamId: string | number, page: number = 1) {
  return await fetchJson<any>(`${BASE}/v2/team/matches?id=${encodeURIComponent(String(teamId))}&page=${page}`, { next: { revalidate: 60 * 5 } });
}

export async function getMatchDetails(matchId: string | number) {
  return await fetchJson<any>(`${BASE}/v2/match/details?match_id=${encodeURIComponent(String(matchId))}`, { next: { revalidate: 60 * 30 } });
}

export async function getEvents(q?: "upcoming" | "completed", page: number = 1) {
  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (page) qs.set("page", String(page));
  const url = `${BASE}/v2/events${qs.toString() ? `?${qs.toString()}` : ""}`;
  return await fetchJson<any>(url, { next: { revalidate: 60 * 30 } });
}

export async function getEventMatches(eventId: string) {
  const url = `${BASE}/v2/events/matches?event_id=${encodeURIComponent(eventId)}`;
  return await fetchJson<any>(url, { next: { revalidate: 60 * 10 } });
}

/**
 * Best-effort: resolve an event "slug" from the router to a VLR event segment.
 * Accepts either:
 *  - a numeric event id (e.g. "2095")
 *  - a full/partial url path containing "/event/<id>"
 */
export async function getEventDetails(slug: string) {
  const normalized = String(slug || "").trim();
  const idMatch = normalized.match(/(\d{3,6})/);
  const wantedId = idMatch ? idMatch[1] : "";

  // try upcoming first
  const up = await getEvents("upcoming").catch(() => null);
  const upSegs = (up as any)?.data?.segments ?? [];
  let found = upSegs.find((s: any) => (wantedId && String(s?.url_path || "").includes(`/event/${wantedId}`)) || String(s?.url_path || "").includes(normalized));

  // completed pages (limited)
  if (!found) {
    for (let p = 1; p <= 3; p++) {
      const comp = await getEvents("completed", p).catch(() => null);
      const segs = (comp as any)?.data?.segments ?? [];
      found = segs.find((s: any) => (wantedId && String(s?.url_path || "").includes(`/event/${wantedId}`)) || String(s?.url_path || "").includes(normalized));
      if (found) break;
    }
  }

  return { status: "success", data: found ?? null };
}
