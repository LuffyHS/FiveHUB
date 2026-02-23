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
      {/* HERO ARENA */}
      <section
        style={{
          position: "relative",
          minHeight: 520,
          paddingTop: 24,
          paddingBottom: 22,
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(/hero-arena.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.05) contrast(1.05)",
            transform: "scale(1.02)",
          }}
        />
        {/* vignette */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(900px 500px at 30% 35%, rgba(255,0,76,0.22), transparent 62%), radial-gradient(800px 420px at 70% 65%, rgba(120,64,255,0.14), transparent 58%), radial-gradient(900px 520px at 50% 10%, rgba(0,0,0,0.10), transparent 60%)",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 820 }}>
              <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
                Killzone HUB • Valorant competitivo
              </div>
              <h1 style={{ margin: 0, fontSize: 56, letterSpacing: -0.8, lineHeight: 1.02 }}>
                O melhor do cenário <br />
                competitivo de <span style={{ opacity: 0.9 }}>Valorant</span>
              </h1>
              <p className="muted" style={{ marginTop: 14, maxWidth: 640, fontSize: 16 }}>
                Ao vivo, próximas partidas e calendário Tier 1 — com visual premium e dados best-effort.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
                <Link className="btn" href="/ao-vivo">Ver ao vivo</Link>
                <Link className="btn secondary" href="/eventos">Explorar eventos</Link>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: 14,
                minWidth: 280,
                alignSelf: "flex-start",
                background: "rgba(10,10,14,0.55)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="cardTitle" style={{ marginBottom: 10 }}>Agora</div>
              <div className="kpis" style={{ marginTop: 0 }}>
                <span className="muted">● Ao vivo: <b>{liveCount}</b></span>
                <span className="muted">Próximas: <b>{upcomingCount}</b></span>
                <span className="muted">Eventos: <b>{eventsCount}</b></span>
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
                Atualiza automaticamente.
              </div>
            </div>
          </div>

          {/* CARDS ROW */}
          <div className="grid cols3" style={{ marginTop: 26 }}>
            <Link className="cardLink" href="/ao-vivo">
              <div className="card" style={{ background: "rgba(20,20,26,0.62)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(10px)" }}>
                <div className="cardTitle">Ao vivo agora</div>
                <div className="muted" style={{ marginTop: 8 }}>Veja partidas acontecendo neste momento.</div>
              </div>
            </Link>

            <Link className="cardLink" href="/partidas">
              <div className="card" style={{ background: "rgba(20,20,26,0.62)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(10px)" }}>
                <div className="cardTitle">Próximas partidas</div>
                <div className="muted" style={{ marginTop: 8 }}>Agenda e horários das próximas séries.</div>
              </div>
            </Link>

            <Link className="cardLink" href="/eventos">
              <div className="card" style={{ background: "rgba(20,20,26,0.62)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(10px)" }}>
                <div className="cardTitle">Eventos em destaque</div>
                <div className="muted" style={{ marginTop: 8 }}>Calendário Tier 1 e torneios em andamento.</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* BELOW HERO: keep your premium content */}
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
