export type Circuit = "vct" | "gc" | "challengers";
export type EventScope = "regional" | "international";

export type EsportsEvent = {
  slug: string;
  name: string;
  circuit: Circuit;
  scope: EventScope;
  // When scope is regional, regions may be provided (Americas/EMEA/Pacific/China or country/area for Challengers)
  regions?: string[];
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  featured?: boolean;
  tags?: string[];
};

export const VCT_2026: EsportsEvent[] = [
  { slug: "vct-kickoff-2026", name: "Kickoff", circuit: "vct", scope: "regional", regions: ["Americas","EMEA","Pacific","China"], start: "2026-01-15", end: "2026-02-15", featured: true, tags: ["Kickoff"] },
  { slug: "masters-santiago-2026", name: "Masters Santiago", circuit: "vct", scope: "international", start: "2026-02-28", end: "2026-03-16", featured: true, tags: ["Masters"] },
  { slug: "vct-stage-1-2026", name: "Fase 1", circuit: "vct", scope: "regional", regions: ["Americas","EMEA","Pacific","China"], start: "2026-04-01", end: "2026-05-24", tags: ["Stage 1"] },
  { slug: "masters-london-2026", name: "Masters London", circuit: "vct", scope: "international", start: "2026-06-06", end: "2026-06-21", featured: true, tags: ["Masters"] },
  { slug: "vct-stage-2-2026", name: "Fase 2", circuit: "vct", scope: "regional", regions: ["Americas","EMEA","Pacific","China"], start: "2026-06-30", end: "2026-09-06", tags: ["Stage 2"] },
  { slug: "champions-shanghai-2026", name: "Champions Shanghai", circuit: "vct", scope: "international", start: "2026-09-17", end: "2026-10-11", featured: true, tags: ["Champions"] },
];
