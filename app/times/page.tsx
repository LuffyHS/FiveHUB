import Link from "next/link";
import { Section } from "@/components/Section";
import { getTeamMatches } from "@/lib/vlrggapi";

export const dynamic = "force-dynamic";

function extractMatches(payload: any): any[] {
  const d = payload?.data ?? payload;
  return d?.segments ?? d?.matches ?? d?.data ?? d ?? [];
}

export default async function HistoricoPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string, league?: string } }) {
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const league = searchParams.league ?? "";
  const teamId = params.id;

  const matches = await getTeamMatches(teamId, page).catch(()=>null);
  const rows = extractMatches(matches);

  return (
    <div className="container">
      <Section>
        <div className="breadcrumbs">
          <Link href={`/times/${encodeURIComponent(teamId)}?league=${encodeURIComponent(league)}`} className="muted">← Voltar</Link>
        </div>
        <h1 className="teamName">Histórico</h1>
        <p className="muted">Página {page}</p>
      </Section>

      <Section>
        {rows?.length ? (
          <div className="grid">
            {rows.map((m:any)=>(
              <a key={m.match_id ?? m.id ?? Math.random()} className="cardLink" href={m.url ?? "#"}>
                <div className="card">
                  <div className="cardTitle">{m.team1 ?? m.team_one ?? "TBD"} <span className="muted">vs</span> {m.team2 ?? m.team_two ?? "TBD"}</div>
                  <div className="muted">{m.event ?? m.tournament ?? ""}</div>
                  <div className="muted">{m.score ?? m.scoreline ?? ""}</div>
                </div>
              </a>
            ))}
          </div>
        ) : <p className="muted">Sem dados nessa página.</p>}
        <div className="pager">
          {page > 1 ? <Link className="btn secondary" href={`/times/${encodeURIComponent(teamId)}/historico?page=${page-1}&league=${encodeURIComponent(league)}`}>Anterior</Link> : <span />}
          <Link className="btn secondary" href={`/times/${encodeURIComponent(teamId)}/historico?page=${page+1}&league=${encodeURIComponent(league)}`}>Próxima</Link>
        </div>
      </Section>
    </div>
  );
}
