import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventDetails, getEventMatches } from "@/lib/vlrggapi";
import { Section } from "@/components/Section";

export const dynamic = "force-dynamic";

function extractEventId(slug: string) {
  const m = String(slug || "").match(/(\d{3,6})/);
  return m ? m[1] : "";
}

export default async function EventoPage({ params }: { params: { slug: string } }) {
  const details = await getEventDetails(params.slug).catch(() => null);
  const event = (details as any)?.data;

  const title =
    event?.title ||
    event?.name ||
    event?.event ||
    (params.slug ? `Evento ${params.slug}` : "Evento");

  const eventId = extractEventId(event?.url_path || params.slug);
  const matchesRes = eventId ? await getEventMatches(eventId).catch(() => null) : null;
  const matches = (matchesRes as any)?.data?.matches ?? (matchesRes as any)?.data?.segments ?? [];

  if (!event && !matches?.length) return notFound();

  return (
    <div className="container">
      <Section title={title}>
        <div className="breadcrumbs">
          <Link href="/eventos" className="muted">
            ← Voltar
          </Link>
        </div>

        <h1 style={{ marginTop: 10 }}>{title}</h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 10 }}>
          {event?.status ? <span className="pill">Status: {event.status}</span> : null}
          {event?.dates ? <span className="pill">{event.dates}</span> : null}
          {event?.prize ? <span className="pill">{event.prize}</span> : null}
          {event?.region ? <span className="pill">Região: {event.region}</span> : null}
        </div>

        {event?.url_path ? (
          <p className="muted" style={{ marginTop: 10 }}>
            Fonte: {event.url_path}
          </p>
        ) : null}

        {matches?.length ? (
          <div style={{ marginTop: 18 }}>
            <h2 className="sectionTitle">Partidas</h2>
            <div className="list">
              {matches.map((m: any, idx: number) => (
                <div key={m.match_id || idx} className="listItem">
                  <div className="listTitle">
                    {m.teams?.team1 || m.team1 || "TBD"} vs {m.teams?.team2 || m.team2 || "TBD"}
                  </div>
                  <div className="muted">
                    {m.score ? `Score: ${m.score} • ` : ""}
                    {m.date || m.time_until_match || ""}
                    {m.event ? ` • ${m.event}` : ""}
                  </div>
                  {m.match_page ? (
                    <a className="muted" href={m.match_page} target="_blank" rel="noreferrer">
                      Abrir no VLR
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="muted" style={{ marginTop: 18 }}>
            Nenhuma partida encontrada para este evento.
          </p>
        )}
      </Section>
    </div>
  );
}
