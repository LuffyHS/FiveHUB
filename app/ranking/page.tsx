"use client";

import { useEffect, useState } from "react";
import type { LeagueRegion } from "@/lib/regions";
import { REGION_LABEL, VLRGGAPI_REGION_CODES } from "@/lib/regions";

export const dynamic = "force-dynamic";

const leagues: LeagueRegion[] = ["americas", "emea", "pacific", "china"];

export default function RankingPage() {
  const [league, setLeague] = useState<LeagueRegion>("americas");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const region = VLRGGAPI_REGION_CODES[league][0]; // use first representative region
    let alive = true;
    setLoading(true);
    fetch(`/api/rankings?region=${encodeURIComponent(region)}`)
      .then((r) => r.json())
      .then((j) => alive && setRows(j.rankings ?? []))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [league]);

  return (
    <div className="container">
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Ranking (dinâmico)</h2>
          <p className="muted">Fonte: vlrggapi rankings.</p>
        </div>

        <div className="filters">
          <div className="filter">
            <label>Liga</label>
            <select value={league} onChange={(e) => setLeague(e.target.value as LeagueRegion)}>
              {leagues.map((l) => <option key={l} value={l}>{REGION_LABEL[l]}</option>)}
            </select>
          </div>
        </div>

        {loading ? <p className="muted">Carregando…</p> : null}

        <div className="grid-cards">
          {rows.slice(0, 25).map((r: any, idx: number) => (
            <div key={idx} className="card">
              <div className="card-title">#{r.rank} {r.team}</div>
              <div className="card-subtitle">{r.country} • {r.record} • {r.earnings}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}