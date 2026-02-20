import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/Section";
import { EVENTS_2026, formatDateRangePT } from "@/data/events";

export const dynamic = "force-dynamic";

export default function EventoPage({ params }: { params: { slug: string } }) {
  const e = EVENTS_2026.find((x) => x.slug === params.slug);
  if (!e) return notFound();

  return (
    <div className="container">
      <Section>
        <div className="breadcrumbs">
          <Link href="/eventos" className="muted">← Voltar</Link>
        </div>

        <h1 className="teamName">{e.name}</h1>
        <p className="muted">{formatDateRangePT(e.start, e.end)} • {e.circuit.toUpperCase()} • {e.scope === "international" ? "Internacional" : "Regional"}</p>
        {e.regions?.length ? <p className="muted">Regiões: {e.regions.join(" • ")}</p> : null}
        {e.tags?.length ? <p className="muted">Tags: {e.tags.join(" • ")}</p> : null}
      </Section>
    </div>
  );
}
