import { Section } from "@/components/Section";
import { getLiveMatches, getUpcomingMatches } from "@/lib/vlrggapi";

export const dynamic = "force-dynamic";

function pickLogo(url?: string) {
  if (!url) return "/placeholder-team.svg";
  return `/api/img?url=${encodeURIComponent(url.startsWith("http") ? url : `https:${url}`)}`;
}

export default async function AoVivoPage() {
  const live = await getLiveMatches();
  const upcoming = await getUpcomingMatches();
  const matches = live?.data?.segments ?? [];

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
      <Section title="Próximas Partidas">
        <div className="grid">
          {(upcoming?.data?.segments ?? []).slice(0, 12).map((m: any, idx: number) => (
            <a
              key={idx}
              className="card"
              href={m.match_page?.startsWith("http") ? m.match_page : `https://www.vlr.gg${m.match_page}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="row">
                <div className="muted">{m.time_until_match || m.unix_timestamp || ""}</div>
                <div className="pill">UPCOMING</div>
              </div>
              <div className="title">{m.team1} vs {m.team2}</div>
              <div className="muted">{m.event_name}</div>
            </a>
          ))}
        </div>
      </Section>

    </div>
  );
}