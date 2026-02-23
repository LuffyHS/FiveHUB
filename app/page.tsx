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
    <main className="container">
      <div className="hero" style={{ marginTop: 10 }}>
        <div className="heroPoster">
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: 22,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.9 }} className="muted">
              Killzone HUB • Valorant competitivo
            </div>
            <h1 style={{ margin: 0, fontSize: 40, letterSpacing: -0.5 }}>
              Tudo do VCT, em um só lugar.
            </h1>
            <p className="muted" style={{ margin: 0, maxWidth: 560 }}>
              Times Tier 1, eventos, partidas e jogadores — com visual premium e
              dados best-effort (sem quebrar seu deploy).
            </p>

            <div className="kpis">
              <span className="muted">Ao vivo: <b>{liveCount}</b></span>
              <span className="muted">Próximas: <b>{upcomingCount}</b></span>
              <span className="muted">Eventos: <b>{eventsCount}</b></span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="cardTitle">Acesso rápido</div>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <Link className="cardLink" href="/ao-vivo">
              <div className="card" style={{ padding: 14 }}>
                <div className="cardTitle">Ao vivo</div>
                <div className="muted">Partidas acontecendo agora</div>
              </div>
            </Link>

            <Link className="cardLink" href="/times">
              <div className="card" style={{ padding: 14 }}>
                <div className="cardTitle">Times</div>
                <div className="muted">Tier 1 • ranking e páginas</div>
              </div>
            </Link>

            <Link className="cardLink" href="/jogadores">
              <div className="card" style={{ padding: 14 }}>
                <div className="cardTitle">Jogadores</div>
                <div className="muted">Perfis, avatars e agentes</div>
              </div>
            </Link>

            <Link className="cardLink" href="/eventos">
              <div className="card" style={{ padding: 14 }}>
                <div className="cardTitle">Eventos</div>
                <div className="muted">Calendário e torneios</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <h2 style={{ margin: "12px 0 8px" }}>Explorar</h2>
        <div className="grid cols4">
          <Link className="cardLink" href="/ranking">
            <div className="card">
              <div className="cardTitle">Ranking</div>
              <div className="muted">Regiões e posições</div>
            </div>
          </Link>

          <Link className="cardLink" href="/noticias">
            <div className="card">
              <div className="cardTitle">Notícias</div>
              <div className="muted">Atualizações e highlights</div>
            </div>
          </Link>

          <Link className="cardLink" href="/perfil">
            <div className="card">
              <div className="cardTitle">Perfil</div>
              <div className="muted">Login e Riot ID</div>
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
