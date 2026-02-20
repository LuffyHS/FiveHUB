import Link from "next/link";
import { Section } from "@/components/Section";
import { ORLANDOMM_REGION_CODES, REGION_LABEL, type LeagueRegion } from "@/lib/regions";
import { getTeams } from "@/lib/vlrOrlandomm";

function pickLogo(logo?: string) {
  if (!logo) return "/placeholder-team.svg";
  // route through our proxy to avoid mixed content/hotlink issues
  return `/api/img?url=${encodeURIComponent(logo.startsWith("http") ? logo : `https:${logo}`)}`;
}

async function fetchLeagueTeams(league: LeagueRegion) {
  // We fetch multiple region codes and merge.
  const codes = ORLANDOMM_REGION_CODES[league];
  const results: any[] = [];
  for (const code of codes) {
    const data = await getTeams({ region: code, limit: 50, page: 1 });
    const teams = data?.data?.teams ?? data?.teams ?? data?.data?.segments ?? [];
    for (const t of teams) results.push({ ...t, _region: code });
  }
  // naive de-dupe by name/id
  const seen = new Set<string>();
  return results.filter((t) => {
    const key = String(t.id ?? t.name);
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
          Fonte: VLR (via orlandomm API). Alguns filtros Tier 1 precisam de ajuste fino (configurável em <code>data/tier1.ts</code>).
        </p>

        {leagueTeams.map(([league, teams]) => (
          <div key={league} style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 12 }}>{REGION_LABEL[league]}</h3>
            <div className="grid-cards">
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
