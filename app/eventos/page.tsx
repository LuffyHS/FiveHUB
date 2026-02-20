import Link from "next/link";
import { Section } from "@/components/Section";
import { getEvents } from "@/lib/vlrggapi";

export const dynamic = "force-dynamic";

export default async function EventosPage() {
  const data = await getEvents().catch(() => null);
  const events = ((data as any)?.data?.segments ?? (data as any)?.data ?? (data as any) ?? []) as any[];

  return (
    <div className="container">
      <Section title="Eventos">
        <div className="breadcrumbs">
          <Link href="/" className="muted">← Home</Link>
        </div>

        <h1 style={{ marginTop: 10 }}>Eventos</h1>
        <p className="muted">Campeonatos e torneios (Tier 1) — dados via VLR.</p>

        <div className="grid" style={{ marginTop: 16 }}>
          {events.length ? events.map((e: any) => {
            const slug = e?.slug || e?.id || e?.event_id || e?.url?.split("/")?.pop();
            const title = e?.title || e?.name || e?.event || slug || "Evento";
            const date = e?.date || e?.dates || e?.status || "";
            return (
              <Link key={slug || title} href={`/eventos/${encodeURIComponent(String(slug))}`} className="cardLink">
                <div className="card">
                  <div className="cardTitle">{title}</div>
                  {date ? <div className="muted">{date}</div> : <div className="muted">—</div>}
                </div>
              </Link>
            );
          }) : (
            <p className="muted">Nenhum evento encontrado no momento.</p>
          )}
        </div>
      </Section>
    </div>
  );
}
