import Link from "next/link";
import { Section } from "@/components/Section";
import { getTeam } from "@/lib/vlrOrlandomm";
import { getTeamProfile, getTeamMatches, getMatchDetails } from "@/lib/vlrggapi";
import { extractVlrTeamId } from "@/lib/vlrId";

export const dynamic = "force-dynamic";

function pickLogo(logo?: string) {
  if (!logo) return "/placeholder-team.svg";
  const fixed = logo.startsWith("http") ? logo : `https:${logo}`;
  return `/api/img?url=${encodeURIComponent(fixed)}`;
}

function extractMapName(details: any): string | null {
  const d = details?.data ?? details;
  const cands = [
    d?.map,
    d?.match?.map,
    d?.maps?.[0]?.map,
    d?.maps?.[0]?.name,
    d?.game?.map,
  ];
  for (const c of cands) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

function norm(s: any) {
  return String(s ?? "").trim().toLowerCase();
}

type MapRow = { map: string; games: number; wins: number; losses: number; winrate: number };

export default async function TimePage({ params }: { params: { id: string } }) {
  // 1) Base data (orlandomm) for name/url/logo when available
  const base = await getTeam(params.id).catch(() => null);
  const team = (base as any)?.data ?? (base as any)?.team ?? base ?? {};

  // 2) Resolve VLR team id (for matches/roster/logo)
  const vlrTeamId = extractVlrTeamId(team) ?? (/^\d+$/.test(params.id) ? params.id : null);

  // 3) Pull VLR profile + latest matches (if we have an id)
  const profile = vlrTeamId ? await getTeamProfile(vlrTeamId).catch(() => null) : null;
  const profData = profile?.data ?? profile;

  const latestMatchesResp = vlrTeamId ? await getTeamMatches(vlrTeamId, 1).catch(() => null) : null;
  const latestMatches = (latestMatchesResp?.data?.segments ?? latestMatchesResp?.data ?? latestMatchesResp ?? []) as any[];

  const displayName = team?.name ?? profData?.name ?? "Time";
  const displayLogo = team?.logo ?? profData?.logo ?? profData?.data?.logo;

  // 4) Roster (prefer VLR profile roster if present)
  const roster = (profData?.players ?? profData?.data?.players ?? team?.players ?? []) as any[];

  // 5) Map pool (lite): fetch details for first N matches and aggregate by map
  const N = 10;
  const matchesSlice = latestMatches.slice(0, N);

  const detailsSettled = await Promise.allSettled(
    matchesSlice.map(async (m: any) => {
      const matchId = m?.match_id ?? m?.id ?? m?.match?.id;
      if (!matchId) return null;
      const det = await getMatchDetails(matchId).catch(() => null);
      return { match: m, details: det };
    })
  );

  const mapAgg = new Map<string, { games: number; wins: number; losses: number }>();
  for (const s of detailsSettled) {
    if (s.status !== "fulfilled" || !s.value) continue;
    const { match, details } = s.value as any;
    const mapName = extractMapName(details);
    if (!mapName) continue;

    const aName = norm(match?.team1 ?? match?.teams?.[0]?.name);
    const bName = norm(match?.team2 ?? match?.teams?.[1]?.name);
    const me = norm(displayName);

    const score1 = Number(match?.score1 ?? match?.team1_score ?? match?.teams?.[0]?.score ?? 0);
    const score2 = Number(match?.score2 ?? match?.team2_score ?? match?.teams?.[1]?.score ?? 0);

    // Determine if "we" are team1 or team2
    let isTeam1 = false;
    if (aName && me && aName === me) isTeam1 = true;
    else if (bName && me && bName === me) isTeam1 = false;
    else {
      // fallback: contains
      if (aName.includes(me)) isTeam1 = true;
      else if (bName.includes(me)) isTeam1 = false;
      else continue;
    }

    const won = (isTeam1 && score1 > score2) || (!isTeam1 && score2 > score1);
    const entry = mapAgg.get(mapName) ?? { games: 0, wins: 0, losses: 0 };
    entry.games += 1;
    if (score1 === 0 && score2 === 0) {
      // no result
    } else if (won) entry.wins += 1;
    else entry.losses += 1;
    mapAgg.set(mapName, entry);
  }

  const mapPool: MapRow[] = Array.from(mapAgg.entries())
    .map(([map, v]) => ({
      map,
      games: v.games,
      wins: v.wins,
      losses: v.losses,
      winrate: v.games ? Math.round((v.wins / v.games) * 100) : 0,
    }))
    .sort((a, b) => b.games - a.games);

  return (
    <div className="container">
      <Section title={displayName}>
        {/* Header */}
        <div className="teamHeader">
          <div className="teamIdentity">
            <img className="teamLogo" alt={displayName} src={pickLogo(displayLogo)} />
            <div>
              <h1 className="teamName">{displayName}</h1>
              <div className="teamMeta">{team?.country ?? team?.region ?? ""}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {team?.url ? (
                  <a className="link" href={team.url} target="_blank" rel="noreferrer">
                    Ver no VLR
                  </a>
                ) : null}
                {vlrTeamId ? (
                  <Link className="link" href={`/times/${encodeURIComponent(params.id)}/historico`}>
                    Ver histórico completo →
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="section">
          <h2 className="sectionTitle">Players</h2>
          {Array.isArray(roster) && roster.length > 0 ? (
            <div className="rosterGrid">
              {roster.map((p: any) => (
                <a key={String(p.id ?? p.name)} className="playerCard" href={`/jogadores/${encodeURIComponent(p.name)}`}>
                  <div className="playerName">{p.name}</div>
                  {p.role ? <div className="muted">{p.role}</div> : null}
                </a>
              ))}
            </div>
          ) : (
            <p className="muted">Roster não disponível para este time.</p>
          )}
        </div>

        {/* Latest matches */}
        <div className="section">
          <h2 className="sectionTitle">Últimas partidas</h2>
          {latestMatches.length ? (
            <div className="matchesList">
              {latestMatches.slice(0, 10).map((m: any) => (
                <div key={String(m.match_id ?? m.id)} className="matchRow">
                  <div className="matchTeams">
                    <span className="matchTeam">{m.team1}</span>
                    <span className="muted">vs</span>
                    <span className="matchTeam">{m.team2}</span>
                  </div>
                  <div className="matchMeta">
                    <span className="matchScore">{m.score1 ?? 0}-{m.score2 ?? 0}</span>
                    <span className="muted">{m.event ?? m.match_event ?? ""}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Sem partidas encontradas para este time.</p>
          )}
        </div>

        {/* Map pool */}
        <div className="section">
          <h2 className="sectionTitle">Map Pool (últimas {N} partidas)</h2>
          {mapPool.length ? (
            <div className="card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mapa</th>
                    <th>Jogos</th>
                    <th>W</th>
                    <th>L</th>
                    <th>WR</th>
                  </tr>
                </thead>
                <tbody>
                  {mapPool.map((r) => (
                    <tr key={r.map}>
                      <td>{r.map}</td>
                      <td>{r.games}</td>
                      <td>{r.wins}</td>
                      <td>{r.losses}</td>
                      <td>{r.winrate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">Map Pool ainda não disponível (precisa de detalhes das partidas).</p>
          )}
        </div>
      </Section>
    </div>
  );
}
