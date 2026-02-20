import type { EsportsEvent } from "./vct-2026";

export const CHALLENGERS_2026: EsportsEvent[] = [
  // Challengers varies per region/country. Keep this list lightweight and expand over time.
  { slug: "challengers-split-1-2026", name: "Challengers Split 1", circuit: "challengers", scope: "regional", regions: ["Americas","EMEA","Pacific","China"], start: "2026-01-10", end: "2026-03-15", tags: ["Challengers"] },
  { slug: "challengers-split-2-2026", name: "Challengers Split 2", circuit: "challengers", scope: "regional", regions: ["Americas","EMEA","Pacific","China"], start: "2026-04-10", end: "2026-06-20", tags: ["Challengers"] },
];
