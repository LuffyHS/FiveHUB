import { Section } from "@/components/Section";
import { getLiveMatches } from "@/lib/vlrggapi";

export const dynamic = "force-dynamic";

function pickLogo(url?: string) {
  if (!url) return "/placeholder-team.svg";
  return `/api/img?url=${encodeURIComponent(url.startsWith("http") ? url : `https:${url}`)}`;
}

export default async function AoVivoPage() {
  const data = await getLiveMatches();
  const matches = data?.data?.segments ?? [];

  return (
    <div className="container">
      <Section title="Partidas ao vivo">
        {matches.length === 0 ? (
          <p className="muted">Nenhuma partida ao vivo agora.</p>
        ) : (
          <div className="grid-cards">
            {matches.map((m: any, idx: number) => (
              <a key={idx} className="card" href={m.match_page?.startsWith("http") ? m.match_page : `https://www.vlr.gg${m.match_page}`} target="_blank" rel="noreferrer">
                <div className="card-title">{m.team1} vs {m.team2}</div>
                <div className="card-subtitle">{m.match_event}</div>
                <div className="kpi-row">
                  <span><img className="card-logo" alt="" src={pickLogo(m.team1_logo)} /> {m.score1}</span>
                  <span><img className="card-logo" alt="" src={pickLogo(m.team2_logo)} /> {m.score2}</span>
                  <span>Mapa: <b>{m.current_map}</b></span>
                </div>
              </a>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}