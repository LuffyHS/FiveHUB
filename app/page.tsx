import Link from "next/link";
import styles from "./ChampionsHero.module.css";
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
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.left}>
            <div className={styles.eyebrow}>Killzone HUB • Valorant competitivo</div>

            <h1 className={styles.title}>
              VCT <span className={styles.soft}>Champions</span> vibe.
              <br />
              Dados em tempo real.
            </h1>

            <p className={styles.desc}>
              Ao vivo, próximas partidas, eventos e times Tier 1 — com visual premium e build estável.
            </p>

            <div className={styles.ctas}>
              <Link className={styles.btnPrimary} href="/ao-vivo">
                Ver ao vivo
              </Link>
              <Link className={styles.btnSecondary} href="/eventos">
                Explorar eventos
              </Link>
              <Link className={styles.btnGhost} href="/times">
                Times Tier 1
              </Link>
            </div>

            <div className={styles.kpisRow}>
              <div className={styles.kpi}>
                <span className={styles.dot} /> Ao vivo <b>{liveCount}</b>
              </div>
              <div className={styles.kpi}>
                Próximas <b>{upcomingCount}</b>
              </div>
              <div className={styles.kpi}>
                Eventos <b>{eventsCount}</b>
              </div>
            </div>
          </div>

          <aside className={styles.right}>
            <div className={styles.panelTitle}>Acesso rápido</div>

            <div className={styles.cards}>
              <Link className={styles.cardLink} href="/ao-vivo">
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Ao vivo</div>
                  <div className={styles.cardDesc}>Partidas acontecendo agora</div>
                </div>
              </Link>

              <Link className={styles.cardLink} href="/partidas">
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Próximas</div>
                  <div className={styles.cardDesc}>Agenda e horários do dia</div>
                </div>
              </Link>

              <Link className={styles.cardLink} href="/times">
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Times</div>
                  <div className={styles.cardDesc}>Tier 1 • ranking e páginas</div>
                </div>
              </Link>

              <Link className={styles.cardLink} href="/jogadores">
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Jogadores</div>
                  <div className={styles.cardDesc}>Perfis, avatars e agentes</div>
                </div>
              </Link>
            </div>

            <div className={styles.hint}>
              Dica: use o ⚙️ no topo para ajustar tema e background.
            </div>
          </aside>
        </div>

        <div className={styles.scrollCue} aria-hidden>
          <div className={styles.scrollPill}>
            <span className={styles.scrollDot} />
          </div>
          <div className={styles.scrollText}>scroll</div>
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

          <Link className="cardLink" href="/eventos">
            <div className="card">
              <div className="cardTitle">Agenda</div>
              <div className="muted">Eventos em andamento</div>
            </div>
          </Link>

          <Link className="cardLink" href="/ao-vivo">
            <div className="card">
              <div className="cardTitle">Ao vivo</div>
              <div className="muted">Lives e placares</div>
            </div>
          </Link>

          <Link className="cardLink" href="/times">
            <div className="card">
              <div className="cardTitle">Times</div>
              <div className="muted">Páginas individuais</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
