import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/Section";
import { EVENTS_2026, formatDateRangePT } from "@/data/events";

export const dynamic = "force-dynamic";

export default async function EventoSlugPage({ params }: { params: { slug: string } }) {
  const e = EVENTS_2026.find((x) => x.slug === params.slug);
  if (!e) return notFound();

  return (
    <div className="container">
      <Section title={e.name}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <span className="badge">{e.circuit.toUpperCase()}</span>
          <span className="badge">{e.scope === "international" ? "INTERNACIONAL" : "REGIONAL"}</span>
          {e.regions?.slice(0, 4).map((r) => <span key={r} className="badge">{r}</span>)}
        </div>

        <p className="muted" style={{ marginBottom: 14 }}>
          {formatDateRangePT(e.start, e.end)}
        </p>

        <div className="grid-cards">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 6 }}>Map pool (auto)</div>
            <div className="muted">
              Vamos detectar automaticamente a rotação do evento pelos mapas mais jogados no período do campeonato.
            </div>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 6 }}>Times / Ranking</div>
            <div className="muted">
              Próximo passo: listar times participantes e ranking do evento (por circuito).
            </div>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 6 }}>Stats por evento</div>
            <div className="muted">
              Em Times/Jogadores, você poderá filtrar: <b>{e.name}</b> para ver picks, bans, W/L e winrate por mapa.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="/times">Ver Times</Link>
          <Link className="btn btn-ghost" href="/ao-vivo">Ver Ao Vivo</Link>
        </div>
      </Section>
    </div>
  );
}
