import Link from "next/link";
import { Section } from "@/components/Section";
import { getTeam } from "@/lib/vlrOrlandomm";
import { getTeamMatches, getTeamProfile } from "@/lib/vlrggapi";
import { extractVlrTeamId } from "@/lib/vlrId";

export const dynamic = "force-dynamic";

function pickLogo(logo?: string) {
  if (!logo) return "/placeholder-team.svg";
  const fixed = logo.startsWith("http") ? logo : `https:${logo}`;
  return `/api/img?url=${encodeURIComponent(fixed)}`;
}

export default async function TeamHistoryPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams?.page ?? 1) || 1);

  const base = await getTeam(params.id).catch(() => null);
  const team = (base as any)?.data ?? (base as any)?.team ?? base ?? {};
  const vlrTeamId = extractVlrTeamId(team) ?? (/^\d+$/.test(params.id) ? params.id : null);

  const profile = vlrTeamId ? await getTeamProfile(vlrTeamId).catch(() => null) : null;
  const profData = profile?.data ?? profile;

  const resp = vlrTeamId ? await getTeamMatches(vlrTeamId, page).catch(() => null) : null;
  const rows = (resp?.data?.segments ?? resp?.data ?? resp ?? []) as any[];

  const displayName = team?.name ?? profData?.name ?? "Time";
  const displayLogo = team?.logo ?? profData?.logo;

  return (
    <div className="container">
      <Section title={`Histórico — ${displayName}`}>
        <div className="teamIdentity" style={{ marginBottom: 16 }}>
          <img className="teamLogo" alt={displayName} src={pickLogo(displayLogo)} />
          <div>
            <div className="muted">Página {page}</div>
            <Link className="link" href={`/times/${encodeURIComponent(params.id)}`}>← Voltar ao time</Link>
          </div>
        </div>

        {rows.length ? (
          <div className="matchesList">
            {rows.map((m: any) => (
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
          <p className="muted">Sem partidas para exibir.</p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          {page > 1 ? (
            <Link className="btn" href={`/times/${encodeURIComponent(params.id)}/historico?page=${page - 1}`}>← Anterior</Link>
          ) : null}
          <Link className="btn" href={`/times/${encodeURIComponent(params.id)}/historico?page=${page + 1}`}>Próxima →</Link>
        </div>
      </Section>
    </div>
  );
}
