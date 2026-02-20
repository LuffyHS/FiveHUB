import { VCT_2026 } from "./vct-2026";
import { GC_2026 } from "./gc-2026";
import { CHALLENGERS_2026 } from "./challengers-2026";
import type { Circuit, EsportsEvent } from "./vct-2026";

export const EVENTS_2026: EsportsEvent[] = [...VCT_2026, ...GC_2026, ...CHALLENGERS_2026];

export function byCircuit(events: EsportsEvent[], circuit: Circuit) {
  return events.filter(e => e.circuit === circuit).sort((a,b) => a.start.localeCompare(b.start));
}

function todayISO() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

export function classifyEvents(events: EsportsEvent[]) {
  const today = todayISO();
  const live = events.filter(e => e.start <= today && today <= e.end);
  const upcoming = events.filter(e => today < e.start).sort((a,b)=>a.start.localeCompare(b.start));
  const past = events.filter(e => e.end < today).sort((a,b)=>b.end.localeCompare(a.end));
  return { live, upcoming, past, today };
}

export function formatDateRangePT(start: string, end: string) {
  // simple PT-BR formatting: "15 jan. – 15 fev."
  const fmt = (iso: string) => {
    const [y,m,d] = iso.split("-").map(Number);
    const months = ["jan.","fev.","mar.","abr.","mai.","jun.","jul.","ago.","set.","out.","nov.","dez."];
    return `${d} ${months[(m||1)-1]}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}
