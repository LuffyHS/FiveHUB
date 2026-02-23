import Link from "next/link";
import { getLiveMatches, getUpcomingMatches, getEvents } from "@/lib/api";

export const dynamic = "force-dynamic";

function countFrom(data: any): number {
  const arr =
    (data?.data?.segments as any[]) ??
    (data?.data?.matches as any[]) ??
    (data?.data?.items as any[]) ??
    (data?.data as any[]) ??
    (data as any[]);
  return Array.isArray(arr) ? arr.length : 0;
}

export default async function HomePage() {
  const [live, upcoming, events] = await Promise.all([
    getLiveMatches(),
    getUpcomingMatches(),
    getEvents(),
  ]);

  const liveCount = countFrom(live);
  const upcomingCount = countFrom(upcoming);
  const eventsCount = countFrom(events);

  return (
    <main>
      <section className="kzHero">
        <div className="kzHeroBg" aria-hidden />
        <div className="kzHeroVignette" aria-hidden />

        <div className="container kzHeroInner">
          <div className="kzHeroTopRow">
            <div className="kzHeroCopy">
              <div className="muted kzEyebrow">Killzone HUB • Valorant competitivo</div>

              <h1 className="kzHeroTitle">
                O melhor do cenário <br />
                competitivo de <span className="kzHeroTitleSoft">Valorant</span>
              </h1>

              <p className="muted kzHeroDesc">
                Ao vivo, próximas partidas e calendário Tier 1 — com visual premium e dados best-effort.
              </p>

              <div className="kzHeroCtas">
                <Link className="btn" href="/ao-vivo">Ver ao vivo</Link>
                <Link className="btn secondary" href="/eventos">Explorar eventos</Link>
              </div>
            </div>

            <div className="kzNowCard card">
              <div className="cardTitle">Agora</div>
              <div className="kzNowKpis">
                <span className="muted"><span className="kzDot" /> Ao vivo: <b>{liveCount}</b></span>
                <span className="muted">Próximas: <b>{upcomingCount}</b></span>
                <span className="muted">Eventos: <b>{eventsCount}</b></span>
              </div>
              <div className="muted kzNowHint">Atualiza automaticamente.</div>
            </div>
          </div>

          <div className="kzHeroCards grid cols3">
            <Link className="cardLink" href="/ao-vivo">
              <div className="card kzGlassCard">
                <div className="cardTitle">Ao vivo agora</div>
                <div className="muted">Veja partidas acontecendo neste momento.</div>
              </div>
            </Link>

            <Link className="cardLink" href="/partidas">
              <div className="card kzGlassCard">
                <div className="cardTitle">Próximas partidas</div>
                <div className="muted">Agenda e horários das próximas séries.</div>
              </div>
            </Link>

            <Link className="cardLink" href="/eventos">
              <div className="card kzGlassCard">
                <div className="cardTitle">Eventos em destaque</div>
                <div className="muted">Calendário Tier 1 e torneios em andamento.</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: 18, marginBottom: 24 }}>
        <h2 style={{ margin: "12px 0 8px" }}>Explorar</h2>
        <div className="grid cols4">
          <Link className="cardLink" href="/ranking">
            <div className="card">
              <div className="cardTitle">Ranking</div>
              <div className="muted">Regiões e posições</div>
            </div>
          </Link>

          <Link className="cardLink" href="/times">
            <div className="card">
              <div className="cardTitle">Times</div>
              <div className="muted">Tier 1 • páginas individuais</div>
            </div>
          </Link>

          <Link className="cardLink" href="/jogadores">
            <div className="card">
              <div className="cardTitle">Jogadores</div>
              <div className="muted">Perfis, avatars e agentes</div>
            </div>
          </Link>

          <Link className="cardLink" href="/eventos">
            <div className="card">
              <div className="cardTitle">Agenda</div>
              <div className="muted">Eventos em andamento</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
