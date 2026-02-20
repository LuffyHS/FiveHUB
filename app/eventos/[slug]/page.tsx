import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventDetails } from "@/lib/vlrggapi";
import Section from "@/components/Section";

export const dynamic = "force-dynamic";

export default async function EventoPage({ params }: { params: { slug: string } }) {
  const data = await getEventDetails(params.slug).catch(() => null);
  const event = (data as any)?.data || (data as any);

  if (!event) return notFound();

  const title =
    event?.title ||
    event?.name ||
    event?.event ||
    event?.slug ||
    "Evento";

  return (
    <div className="container">
      <Section title={title}>
        <div className="breadcrumbs">
          <Link href="/eventos" className="muted">
            ← Voltar
          </Link>
        </div>

        <h1 style={{ marginTop: 10 }}>{title}</h1>

        {event?.status ? <p className="muted">Status: {event.status}</p> : null}
        {event?.date ? <p className="muted">Data: {event.date}</p> : null}
        {event?.prize ? <p className="muted">Premiação: {event.prize}</p> : null}

        {event?.description ? <p style={{ marginTop: 12 }}>{event.description}</p> : null}

        {/* Fallbacks para diferentes formatos */}
        {event?.segments?.length ? (
          <div style={{ marginTop: 18 }}>
            <h2 className="sectionTitle">Detalhes</h2>
            <ul>
              {event.segments.map((s: any, i: number) => (
                <li key={i} className="muted">
                  {s?.label || s?.title || s?.name || JSON.stringify(s)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>
    </div>
  );
}
