export function extractVlrTeamId(team: any): string | null {
  const candidates: (string | undefined | null)[] = [
    team?.vlr_id,
    team?.vlrId,
    team?.team_id,
    team?.id && typeof team.id === "number" ? String(team.id) : undefined,
    team?.url,
    team?.link,
    team?.profileUrl,
  ];

  for (const c of candidates) {
    if (!c) continue;
    const s = String(c);
    // if it's purely numeric, accept
    if (/^\d+$/.test(s)) return s;
    const m = s.match(/\/team\/(\d+)/);
    if (m) return m[1];
  }
  return null;
}
