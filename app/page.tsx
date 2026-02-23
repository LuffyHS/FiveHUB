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

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "12px 18px",
  borderRadius: 14,
  fontWeight: 700,
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(10px)",
};

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
      {/* HERO (self-contained, no extra CSS needed) */}
      <section
        style={{
          position: "relative",
          minHeight: 640,
          padding: "40px 0 34px",
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
              "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.78)), url(/hero-arena.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.1) contrast(1.05)",
            transform: "scale(1.03)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(900px 520px at 28% 38%, rgba(255,0,76,0.26), transparent 62%), radial-gradient(860px 520px at 72% 62%, rgba(120,64,255,0.18), transparent 62%), linear-gradient(90deg, rgba(0,0,0,0.35), transparent 55%, rgba(0,0,0,0.30))",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div style={{ maxWidth: 860, paddingTop: 28 }}>
              <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
                Killzone HUB • Valorant competitivo
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(38px, 5vw, 72px)",
                  letterSpacing: "-0.9px",
                  lineHeight: 1.03,
                  textShadow: "0 14px 40px rgba(0,0,0,0.55)",
                }}
              >
                O melhor do cenário <br />
                competitivo de <span style={{ opacity: 0.92, fontWeight: 500 }}>Valorant</span>
              </h1>

              <p
                className="muted"
                style={{
                  marginTop: 14,
                  maxWidth: 640,
                  fontSize: 16,
                  textShadow: "0 14px 40px rgba(0,0,0,0.40)",
                }}
              >
                Ao vivo, próximas partidas e calendário Tier 1 — com visual premium e dados best-effort.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
                <Link
                  href="/ao-vivo"
                  style={{
                    ...btnBase,
                    background: "rgba(255,0,76,0.86)",
                    boxShadow: "0 18px 50px rgba(255,0,76,0.25)",
                    color: "white",
                  }}
                >
                  Ver ao vivo
                </Link>
                <Link
                  href="/eventos"
                  style={{
                    ...btnBase,
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                  }}
                >
                  Explorar eventos
                </Link>
              </div>
            </div>

            <div
              style={{
                minWidth: 320,
                maxWidth: 380,
                padding: 16,
                borderRadius: 18,
                background: "rgba(14,14,18,0.55)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                marginTop: 18,
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Agora</div>
              <div style={{ display: "grid", gap: 8 }}>
                <div className="muted">
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: 99,
                      background: "rgb(255,0,76)",
                      boxShadow: "0 0 14px rgba(255,0,76,0.65)",
                      marginRight: 8,
                      transform: "translateY(-1px)",
                    }}
                  />
                  Ao vivo: <b>{liveCount}</b>
                </div>
                <div className="muted">
                  Próximas: <b>{upcomingCount}</b>
                </div>
                <div className="muted">
                  Eventos: <b>{eventsCount}</b>
                </div>
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
                Atualiza automaticamente.
              </div>
            </div>
          </div>

          {/* 3 cards */}
          <div className="grid cols3" style={{ marginTop: 26 }}>
            {[
              {
                href: "/ao-vivo",
                title: "Ao vivo agora",
                desc: "Veja partidas acontecendo neste momento.",
              },
              {
                href: "/partidas",
                title: "Próximas partidas",
                desc: "Agenda e horários das próximas séries.",
              },
              {
                href: "/eventos",
                title: "Eventos em destaque",
                desc: "Calendário Tier 1 e torneios em andamento.",
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="cardLink"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    borderRadius: 18,
                    padding: 16,
                    background: "rgba(18,18,22,0.62)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{c.title}</div>
                  <div className="muted" style={{ marginTop: 8 }}>
                    {c.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KEEP BELOW (minimal) */}
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
