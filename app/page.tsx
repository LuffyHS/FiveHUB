import Link from "next/link";
import { Section } from "@/components/Section";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero hero-premium">
        <div className="hero-inner">
          <div className="hero-badges">
            <span className="badge badge-live">AO VIVO</span>
            <span className="badge badge-vct">VCT 2026</span>
          </div>

          <h1 className="hero-title">
            FiveHUB <span className="hero-title-accent">Valorant</span>
          </h1>

          <p className="hero-subtitle">
            Partidas ao vivo, times Tier 1, pro players, ranking e estatísticas — com visual esportivo premium.
          </p>

          <div className="hero-cta">
            <Link className="btn-large btn-primary" href="/ao-vivo">Assistir Agora</Link>
            <Link className="btn-large btn-secondary" href="/times">Ver Times</Link>
          </div>

          <div className="hero-micro">
            <div className="micro-item">
              <div className="micro-kpi">Ao vivo</div>
              <div className="micro-label">matches & streams</div>
            </div>
            <div className="micro-item">
              <div className="micro-kpi">Tier 1</div>
              <div className="micro-label">Americas • EMEA • Pacific • China</div>
            </div>
            <div className="micro-item">
              <div className="micro-kpi">Stats</div>
              <div className="micro-label">ACS • K/D • ADR • Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Section title="Partidas Ao Vivo" id="live">
        <p className="muted">
          Acesse a página <Link className="link" href="/ao-vivo">Ao Vivo</Link> para ver partidas e placares atualizados.
        </p>
      </Section>

      <Section title="Times" id="teams">
        <p className="muted">
          Explore os times por região na página <Link className="link" href="/times">Times</Link>.
        </p>
      </Section>

      <Section title="Jogadores" id="players">
        <p className="muted">
          Busque pro players e filtros em <Link className="link" href="/jogadores">Jogadores</Link>.
        </p>
      </Section>
    </div>
  );
}
