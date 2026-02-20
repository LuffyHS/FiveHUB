import { fetchJson } from "@/lib/http";

const BASE = "https://vlr.orlandomm.net/api/v1";

export type OrlandommTeam = {
  id: number | string;
  name: string;
  logo?: string;
  country?: string;
  region?: string;
  url?: string;
};

export async function getTeams(params: { region?: string; limit?: number | "all"; page?: number } = {}) {
  const sp = new URLSearchParams();
  if (params.region) sp.set("region", params.region);
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.page) sp.set("page", String(params.page));
  const url = `${BASE}/teams${sp.toString() ? `?${sp.toString()}` : ""}`;
  return await fetchJson<any>(url, { next: { revalidate: 60 * 30 } }); // 30 min
}

export async function getTeam(teamId: string | number) {
  const url = `${BASE}/teams/${teamId}`;
  return await fetchJson<any>(url, { next: { revalidate: 60 * 30 } });
}

export async function getPlayer(playerId: string | number) {
  const url = `${BASE}/players/${playerId}`;
  return await fetchJson<any>(url, { next: { revalidate: 60 * 30 } });
}
