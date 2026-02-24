import Link from "next/link";
import styles from "./HomeVCT.module.css";
import { getLiveMatches, getUpcomingMatches, getEvents } from "@/lib/api";

export const dynamic = "force-dynamic";

type AnyObj = Record<string, any>;

function arrFrom(data: any): any[] {
  const arr =
    (data?.data?.segments as any[]) ??
    (data?.data?.matches as any[]) ??
    (data?.data?.items as any[]) ??
    (data?.data as any[]) ??
    (data as any[]);
  return Array.isArray(arr) ? arr : [];
}

function pickName(x: AnyObj): string {
  return (
    x?.name ||
    x?.event?.name ||
    x?.tournament?.name ||
    x?.team?.name ||
    x?.opponent?.name ||
    x?.title ||
    "—"
  );
}

function pickTeams(m: AnyObj): { a: string; b: string; sa?: number; sb?: number } {
  const teams =
    m?.teams ??
    m?.opponents ??
    m?.match?.teams ??
    m?.match?.opponents ??
    m?.participants ??
    [];
  const t0 = teams?.[0]?.team ?? teams?.[0] ?? {};
  const t1 = teams?.[1]?.team ?? teams?.[1] ?? {};
  const a = t0?.name ?? teams?.[0]?.name ?? "TBD";
  const b = t1?.name ?? teams?.[1]?.name ?? "TBD";
  const sa = m?.score?.[0] ?? m?.scores?.[0] ?? m?.team1_score ?? m?.team1Score;
  const sb = m?.score?.[1] ?? m?.scores?.[1] ?? m?.team2_score ?? m?.team2Score;
  return { a, b, sa: typeof sa === "number" ? sa : undefined, sb: typeof sb === "number" ? sb : undefined };
}

function timeText(m: AnyObj): string {
  const t =
    m?.scheduled_at ||
    m?.scheduledAt ||
    m?.date ||
    m?.time ||
    m?.start_time ||
    m?.startTime ||
    m?.utcStartTime;
  if (!t) return "";
  try {
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default async function HomePage() {
  const [liveRes, upcomingRes, eventsRes] = await Promise.all([
    getLiveMatches(),
    getUpcomingMatches(),
    getEvents(),
  ]);

  const live = arrFrom(liveRes).slice(0, 3);
  const upcoming = arrFrom(upcomingRes).slice(0, 5);
  const events = arrFrom(eventsRes).slice(0, 3);

  const liveCount = arrFrom(liveRes).length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        {/* background image */}
        <div className={styles.bg} aria-hidden />
        <div className={styles.vignette} aria-hidden />

        <div className={styles.content}>
          <div className={styles.headerRow}>
            <div className={styles.brand}>
              {/* Uses your provided logo already in public (kz-logo.png). If not present, it will just show text. */}
              <img className={styles.kzLogo} src="/kz-logo.png" alt="KZ" />
              <div className={styles.brandText}>
                <div className={styles.brandName}>Killzone HUB</div>
                <div className={styles.brandSub}>Valorant</div>
              </div>
            </div>

            <nav className={styles.nav}>
              <Link className={styles.navPill} href="/ao-vivo">Ao vivo</Link>
              <Link className={styles.navPill} href="/times">Times</Link>
              <Link className={styles.navPill} href="/jogadores">Jogadores</Link>
              <Link className={styles.navPill} href="/eventos">Eventos</Link>
              <button className={styles.navIcon} aria-label="Configurações" title="Configurações">⚙️</button>
            </nav>
          </div>

          <div className={styles.liveBadge}>
            <span className={styles.dot} aria-hidden />
            <span><b>{liveCount}</b> partidas ao vivo agora</span>
          </div>

          <div className={styles.heroBody}>
            <div className={styles.eyebrow}>Killzone HUB • Valorant competitivo</div>
            <h1 className={styles.h1}>
              O melhor do cenário
              <br />
              competitivo de Valorant
            </h1>

            <div className={styles.ctas}>
              <Link className={styles.btnPrimary} href="/ao-vivo">Ver ao vivo</Link>
              <Link className={styles.btnSecondary} href="/eventos">Explorar eventos</Link>
            </div>
          </div>

          <div className={styles.panels}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>Ao vivo <span className={styles.soft}>agora</span></div>
                <div className={styles.badge}>{live.length}</div>
              </div>

              <div className={styles.list}>
                {live.length === 0 ? (
                  <div className={styles.empty}>Nenhuma partida ao vivo no momento.</div>
                ) : (
                  live.map((m, idx) => {
                    const t = pickTeams(m);
                    return (
                      <div className={styles.row} key={idx}>
                        <div className={styles.rowLeft}>
                          <div className={styles.rowTitle}>{t.a}</div>
                          <div className={styles.rowSub}>{t.b}</div>
                        </div>
                        <div className={styles.score}>
                          <span>{t.sa ?? "-"}</span>
                          <span className={styles.sep}>—</span>
                          <span>{t.sb ?? "-"}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>Próximas <span className={styles.soft}>partidas</span></div>
                <div className={styles.badge}>{upcoming.length}</div>
              </div>

              <div className={styles.list}>
                {upcoming.length === 0 ? (
                  <div className={styles.empty}>Sem partidas agendadas.</div>
                ) : (
                  upcoming.map((m, idx) => {
                    const t = pickTeams(m);
                    return (
                      <div className={styles.row} key={idx}>
                        <div className={styles.rowLeft}>
                          <div className={styles.rowTitle}>{t.a}</div>
                          <div className={styles.rowSub}>{t.b}</div>
                        </div>
                        <div className={styles.meta}>
                          <div className={styles.metaTop}>{timeText(m)}</div>
                          <div className={styles.metaBottom}>{m?.map ?? m?.game?.map ?? m?.match?.map ?? ""}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>Eventos <span className={styles.soft}>em destaque</span></div>
                <div className={styles.badge}>{events.length}</div>
              </div>

              <div className={styles.list}>
                {events.length === 0 ? (
                  <div className={styles.empty}>Sem eventos no momento.</div>
                ) : (
                  events.map((e, idx) => (
                    <Link className={styles.eventRow} href="/eventos" key={idx}>
                      <div className={styles.rowLeft}>
                        <div className={styles.rowTitle}>{pickName(e)}</div>
                        <div className={styles.rowSub}>{e?.region || e?.location || ""}</div>
                      </div>
                      <div className={styles.meta}>
                        <div className={styles.metaTop}>{e?.status || ""}</div>
                        <div className={styles.metaBottom}>{e?.tier ? `Tier ${e.tier}` : ""}</div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
