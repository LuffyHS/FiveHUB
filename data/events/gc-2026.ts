import type { EsportsEvent } from "./vct-2026";

export const GC_2026: EsportsEvent[] = [
  // NOTE: Adjust these dates/events as needed. We keep them as data so you don't have to change code.
  { slug: "gc-stage-1-2026", name: "Game Changers Stage 1", circuit: "gc", scope: "regional", regions: ["Americas","EMEA","Pacific","China"], start: "2026-01-20", end: "2026-03-30", tags: ["GC"] },
  { slug: "gc-stage-2-2026", name: "Game Changers Stage 2", circuit: "gc", scope: "regional", regions: ["Americas","EMEA","Pacific","China"], start: "2026-05-01", end: "2026-07-31", tags: ["GC"] },
  { slug: "gc-championship-2026", name: "Game Changers Championship", circuit: "gc", scope: "international", start: "2026-11-01", end: "2026-11-20", featured: true, tags: ["GC"] },
];
