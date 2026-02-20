import Link from "next/link";
import { Section } from "@/components/Section";
import { EVENTS_2026, byCircuit, classifyEvents, formatDateRangePT } from "@/data/events";
import type { Circuit, EsportsEvent } from "@/data/events/vct-2026";

export const dynamic = "force-dynamic";

function CircuitTabs({ active }: { active: Circuit }) {
  const tabs: { key: Circuit; label: string }[] = [
    { key: "vct", label: "VCT" },
    { key: "gc", label: "Game Changers" },
    { key: "challengers", label: "Challengers" },
  ];

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={`/eventos?c=${t.key}`}
          className={`pill ${active === t.key ? "pill-active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

function EventRow({ e }: { e: EsportsEvent }) {
  const isInternational = e.scope === "international";
  return (
    <Link href={`/eventos/${e.slug}`} className="event-row">
      <div className="event-row-left">
        <div className={`event-kicker ${isInternational ? "k-international" : "k-regional"}`}>
          {isInternational ? "INTERNACIONAL" : "TODAS AS REGIÕES"}
        </div>
        <div className="event-title">{e.name}</div>
        <div className="event-dates">{formatDateRangePT(e.start, e.end)}</div>
      </div>
      <div className="event-row-right">
        {e.tags?.slice(0, 2).map((t) => (
          <span key={t} className="badge">{t}</span>
        ))}
      </div>
    </Link>
  );
}

export default async function EventosPage({ searchParams }: { searchParams?: { c?: string } }) {
  const circuit = (searchParams?.c as Circuit) || "vct";
  const events = byCircuit(EVENTS_2026, circuit);
  const { live, upcoming, past } = classifyEvents(events);

  return (
    <div className="container">
      <Section title="Calendário de campeonatos">
        <p className="muted">
          VCT + Game Changers + Challengers. Datas são configuráveis em <code>data/events</code>.
        </p>

        <CircuitTabs active={circuit} />

        {live.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <h3 style={{ margin: "14px 0 10px" }}>Ao vivo / em andamento</h3>
            <div className="event-list">
              {live.map((e) => <EventRow key={e.slug} e={e} />)}
            </div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <h3 style={{ margin: "14px 0 10px" }}>Próximos</h3>
            <div className="event-list">
              {upcoming.map((e) => <EventRow key={e.slug} e={e} />)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <h3 style={{ margin: "14px 0 10px" }}>Encerrados</h3>
            <div className="event-list">
              {past.slice(0, 10).map((e) => <EventRow key={e.slug} e={e} />)}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
