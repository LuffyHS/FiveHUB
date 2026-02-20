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
