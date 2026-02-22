// lib/api.ts
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

// Partidas
export async function getLiveMatches() {
  return safeJson(`${VLR_BASE}/match?q=live`);
}
export async function getUpcomingMatches() {
  return safeJson(`${VLR_BASE}/match?q=upcoming`);
}

// Rankings/Times (por região)
export async function getRankings(region: string) {
  return safeJson(`${VLR_BASE}/rankings?region=${encodeURIComponent(region)}`);
}

// Player (perfil básico)
export async function getPlayerByName(playerName: string) {
  return safeJson(`${VLR_BASE}/player/${encodeURIComponent(playerName)}`);
}

// Match details
export async function getMatchDetails(matchId: string) {
  return safeJson(`${VLR_BASE}/match/${encodeURIComponent(matchId)}`);
}

// Team matches (best-effort)
// Nem toda API fornece isso. Mantemos a função para o site não quebrar.
export async function getTeamMatches(teamNameOrId: string) {
  // Alguns forks expõem /team/:id ou /team/:name/matches. Tentamos em ordem.
  const candidates = [
    `${VLR_BASE}/team/${encodeURIComponent(teamNameOrId)}`,
    `${VLR_BASE}/team/${encodeURIComponent(teamNameOrId)}/matches`,
    `${VLR_BASE}/search/team?q=${encodeURIComponent(teamNameOrId)}`,
  ];
  for (const url of candidates) {
    const j = await safeJson(url);
    if (j) return j;
  }
  return null;
}
