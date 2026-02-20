import Link from "next/link";
import { Section } from "@/components/Section";
import { ORLANDOMM_REGION_CODES, REGION_LABEL, type LeagueRegion } from "@/lib/regions";
import { getTeams } from "@/lib/vlrOrlandomm";
import { getRankings } from "@/lib/vlrggapi";

export const dynamic = "force-dynamic";

async function fetchTeamsWithFallback(regionCode: string) {
  const primary = await getTeams({ region: regionCode, limit: 50, page: 1 }).catch(() => null);
  const teams = (primary?.data?.segments ?? primary?.data?.teams ?? primary?.data ?? []) as any[];
  if (teams && teams.length) return teams;

  const rk = await getRankings(regionCode).catch(() => null);
  const rows = (rk?.data?.segments ?? rk?.data?.teams ?? rk?.data ?? []) as any[];
  // normalize to similar shape
  return rows.map((r: any) => ({
    id: r.team_id ?? r.id ?? r.team?.id,
    name: r.team_name ?? r.team ?? r.name ?? r.team?.name,
    logo: r.team_logo ?? r.logo ?? r.team?.logo,
    region: regionCode,
  })).filter((t: any) => t.name);
}


function pickLogo(logo?: string) {
  if (!logo) return "/placeholder-team.svg";
  // route through our proxy to avoid mixed content/hotlink issues
  return `/api/img?url=${encodeURIComponent(logo.startsWith("http") ? logo : `https:${logo}`)}`;
}

async function fetchLeagueTeams(league: LeagueRegion) {
  const codes = ORLANDOMM_REGION_CODES[league];

  // 1) Try orlandomm teams endpoint per region code (best logos/ids)
  const settled = await Promise.allSettled(
    codes.map(async (code) => {
      const data = await getTeams({ region: code, limit: 50, page: 1 });
      const teams = (data as any)?.data?.teams ?? (data as any)?.teams ?? (data as any)?.data?.segments ?? (data as any)?.data ?? [];
      return (teams as any[]).map((t) => ({ ...t, _region: code }));
    })
  );

  let results: any[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") results.push(...r.value);
  }

  // 2) Fallback: derive teams from rankings (vlrggapi) if orlandomm returns nothing
  if (!results.length) {
    const rkCodes = (await import("@/lib/regions")).VLRGGAPI_REGION_CODES[league];
    const rkSettled = await Promise.allSettled(rkCodes.map((code) => getRankings(code)));
    for (const r of rkSettled) {
      if (r.status !== "fulfilled") continue;
      const rows = ((r.value as any)?.data?.segments ?? (r.value as any)?.data?.teams ?? (r.value as any)?.data ?? []) as any[];
      results.push(
        ...rows.map((x: any) => ({
          id: x.team_id ?? x.id ?? x.team?.id,
          name: x.team_name ?? x.team ?? x.name ?? x.team?.name,
          logo: x.team_logo ?? x.logo ?? x.team?.logo,
          _region: league,
        }))
      );
    }
  }

  // de-dupe by id/name
  const seen = new Set<string>();
  return results.filter((t) => {
    const key = String(t.id ?? t.name);
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


export default async function TimesPage() {
  const leagues: LeagueRegion[] = ["americas", "emea", "pacific", "china"];

  const leagueTeams = await Promise.all(leagues.map(async (lg) => [lg, await fetchLeagueTeams(lg)] as const));

  return (
    <div className="container">
      <Section title="Times Tier 1 (organizado por regiões)">
        <p className="muted">
          Fonte: VLR (via orlandomm API). Times vêm da VLR (via orlandomm API). Em breve: filtros por campeonato (VCT/GC/Challengers) + stats por mapa (picks/bans/W-L/WR).
        </p>

        {leagueTeams.map(([league, teams]) => (
          <div key={league} style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 12 }}>{REGION_LABEL[league]}</h3>
            <div className="grid-cards">
              {teams.length === 0 ? (
                <p className="muted">Nenhum time encontrado agora (API instável). Tente novamente em alguns minutos.</p>
              ) : null}
              {teams.slice(0, 24).map((t: any) => (
                <Link key={String(t.id ?? t.name)} href={`/times/${t.id ?? encodeURIComponent(t.name)}`} className="card">
                  <div className="card-header">
                    <img className="card-logo" alt={t.name ?? "Logo"} src={pickLogo(t.logo)} />
                    <div>
                      <div className="card-title">{t.name}</div>
                      <div className="card-subtitle">{t.country ?? t.region ?? ""}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}