import Link from "next/link";
import styles from "./HomeHeroPremium.module.css";

export default function HomeHero() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.bg} aria-hidden="true" />
        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.content}>
          <div>
            <div className={styles.eyebrow}>KILLZONE HUB</div>

            <h1 className={styles.h1}>
              Uma home premium, cinematográfica — do jeitinho VCT.
            </h1>

            <p className={styles.sub}>
              Times Tier 1, jogadores, eventos e partidas em um hub rápido, limpo e pronto
              para Vercel.
            </p>

            <div className={styles.ctas}>
              <Link className={styles.btnPrimary} href="/ao-vivo">
                Ver ao vivo
              </Link>
              <Link className={styles.btnSecondary} href="/eventos">
                Explorar eventos
              </Link>
            </div>

            <div className={styles.rule} />
          </div>
        </div>
      </section>

      <section className={styles.panelsWrap} aria-label="Destaques">
        <div className={styles.panels}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>Ao vivo</div>
              <div className={styles.badge}>●</div>
            </div>
            <div className={styles.list}>
              <Link className={styles.item} href="/ao-vivo">
                <div className={styles.left}>
                  <div className={styles.title}>Partidas em andamento</div>
                  <div className={styles.sub2}>Placares e próximos mapas</div>
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaTop}>Agora</div>
                  <div className={styles.metaBottom}>Atualizado</div>
                </div>
              </Link>

              <Link className={styles.item} href="/ranking">
                <div className={styles.left}>
                  <div className={styles.title}>Ranking do HUB</div>
                  <div className={styles.sub2}>Acompanhe a performance</div>
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaTop}>Top</div>
                  <div className={styles.metaBottom}>Times</div>
                </div>
              </Link>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>Times</div>
              <div className={styles.badge}>T1</div>
            </div>
            <div className={styles.list}>
              <Link className={styles.item} href="/times">
                <div className={styles.left}>
                  <div className={styles.title}>Elencos & lineups</div>
                  <div className={styles.sub2}>Rosters, mudanças e histórico</div>
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaTop}>Base</div>
                  <div className={styles.metaBottom}>Tier 1</div>
                </div>
              </Link>

              <Link className={styles.item} href="/jogadores">
                <div className={styles.left}>
                  <div className={styles.title}>Jogadores</div>
                  <div className={styles.sub2}>Stats, agentes e destaques</div>
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaTop}>Pro</div>
                  <div className={styles.metaBottom}>Perfil</div>
                </div>
              </Link>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>Eventos</div>
              <div className={styles.badge}>✦</div>
            </div>
            <div className={styles.list}>
              <Link className={styles.item} href="/eventos">
                <div className={styles.left}>
                  <div className={styles.title}>Calendário</div>
                  <div className={styles.sub2}>Próximos campeonatos</div>
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaTop}>2026</div>
                  <div className={styles.metaBottom}>Agenda</div>
                </div>
              </Link>

              <Link className={styles.item} href="/noticias">
                <div className={styles.left}>
                  <div className={styles.title}>Notícias</div>
                  <div className={styles.sub2}>Atualizações e bastidores</div>
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaTop}>Feed</div>
                  <div className={styles.metaBottom}>Diário</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
