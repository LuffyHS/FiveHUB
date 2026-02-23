import Link from "next/link";
import { getEvents } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function EventosPage() {
  const data = await getEvents();
  const events = ((data as any)?.data?.segments ?? (data as any)?.data ?? (data as any) ?? []) as any[];

  return (
    <main className="container">
      <h1 style={{ marginTop: 6 }}>Eventos</h1>
      <p className="muted">Calendário e torneios (Tier 1) — fonte VLR (best-effort).</p>

      {!events?.length ? (
        <div className="card"><p className="muted">Sem dados no momento.</p></div>
      ) : (
        <div className="grid cols3" style={{ marginTop: 14 }}>
          {events.slice(0, 30).map((e: any, i: number) => {
            const title = e?.title || e?.name || e?.event || "Evento";
            const slug = e?.slug || e?.id || e?.event_id || String(i);
            const meta = e?.status || e?.date || e?.dates || e?.region || "—";
            return (
              <Link key={slug} className="cardLink" href={`/eventos/${encodeURIComponent(String(slug))}`}>
                <div className="card">
                  <div className="cardTitle">{title}</div>
                  <div className="muted">{meta}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <Link className="muted" href="/">← Voltar</Link>
      </div>
    </main>
  );
}
