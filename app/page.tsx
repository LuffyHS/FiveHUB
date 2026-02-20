import Link from "next/link";
import { Section } from "@/components/Section";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero section">
        <div className="section-header">
          <h1 className="section-title">VAL Esports Hub</h1>
          <p className="muted">
            Times Tier 1, pro players, partidas ao vivo, ranking e notícias — numa estrutura profissional, pronta para Vercel.
          </p>
        </div>

        <div className="grid-cards">
          <Link href="/times" className="card">
            <div className="card-title">🏆 Times (Tier 1)</div>
            <div className="card-subtitle">Americas • EMEA • Pacific • China</div>
          </Link>

          <Link href="/jogadores" className="card">
            <div className="card-title">🎮 Jogadores</div>
            <div className="card-subtitle">Busca + filtros 30/60/90/All</div>
          </Link>

          <Link href="/ao-vivo" className="card">
            <div className="card-title">🔴 Ao vivo</div>
            <div className="card-subtitle">Live scores do VLR</div>
          </Link>

          <Link href="/noticias" className="card">
            <div className="card-title">📰 Notícias</div>
            <div className="card-subtitle">Feed automático</div>
          </Link>

          <Link href="/ranking" className="card">
            <div className="card-title">🏅 Ranking</div>
            <div className="card-subtitle">Top times por região</div>
          </Link>

          <Link href="/perfil" className="card">
            <div className="card-title">👤 Perfil</div>
            <div className="card-subtitle">Discord login + Riot ID (Redis)</div>
          </Link>
        </div>
      </section>

      <Section title="Roadmap do que já está preparado">
        <ul>
          <li><b>Estrutura em páginas separadas</b> (Next.js App Router) + API serverless em <code>/api</code>.</li>
          <li><b>Login Discord</b> (OAuth2) + <b>sessão JWT</b> em cookie httpOnly.</li>
          <li><b>Vercel KV (Redis)</b> para persistir Riot ID por usuário.</li>
          <li><b>Proxy de logos</b> em <code>/api/img</code> com cache.</li>
          <li><b>Ao vivo / notícias / rankings</b> via vlrggapi.</li>
        </ul>
      </Section>
    </div>
  );
}
