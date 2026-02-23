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

/**
 * Histórico (best-effort) de partidas por time.
 *
 * Observação: diferentes "vlrggapi" forks expõem rotas diferentes.
 * A ideia aqui é NUNCA quebrar o deploy: tentamos alguns endpoints comuns e,
 * se nenhum responder, retornamos null (a página lida com isso).
 */
export async function getTeamMatches(teamIdOrQuery: string) {
  const q = encodeURIComponent(teamIdOrQuery);

  const candidates = [
    // alguns forks usam /team/{id} e incluem partidas no payload
    `${VLR_BASE}/team/${q}`,
    // outros usam querystring
    `${VLR_BASE}/team?id=${q}`,
    `${VLR_BASE}/team?team=${q}`,
    `${VLR_BASE}/team?name=${q}`,
    `${VLR_BASE}/team?query=${q}`,
    // alguns expõem rota dedicada de matches por time
    `${VLR_BASE}/team/matches/${q}`,
    `${VLR_BASE}/team/match/${q}`,
    `${VLR_BASE}/matches/team/${q}`,
    `${VLR_BASE}/match?q=team&team=${q}`,
  ];

  for (const u of candidates) {
    const j = await safeJson(u);
    // Aceita payload vazio, mas não "null"
    if (j) return j;
  }
  return null;
}
