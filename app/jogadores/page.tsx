"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LeagueRegion } from "@/lib/regions";
import { REGION_LABEL } from "@/lib/regions";

type PlayerRow = {
  player: string;
  org: string;
  rating: string;
  average_combat_score: string;
  kill_deaths: string;
  average_damage_per_round: string;
  kills_per_round: string;
  assists_per_round: string;
  first_kills_per_round: string;
  headshot_percentage: string;
};

const leagues: LeagueRegion[] = ["americas", "emea", "pacific", "china"];
const timespans = ["30", "60", "90", "all"] as const;

export default function JogadoresPage() {
  const [league, setLeague] = useState<LeagueRegion>("americas");
  const [timespan, setTimespan] = useState<(typeof timespans)[number]>("30");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/stats?league=${league}&timespan=${timespan}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setRows(j.players ?? []);
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [league, timespan]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows.slice(0, 200);
    return rows.filter((r) => (r.player ?? "").toLowerCase().includes(qq) || (r.org ?? "").toLowerCase().includes(qq)).slice(0, 200);
  }, [rows, q]);

  return (
    <div className="container">
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Pro Players (estilo VLR)</h2>
          <p className="muted">Busca + filtros por liga Tier 1 e período. Fonte: vlrggapi.</p>
        </div>

        <div className="filters">
          <div className="filter">
            <label>Liga</label>
            <select value={league} onChange={(e) => setLeague(e.target.value as LeagueRegion)}>
              {leagues.map((l) => <option key={l} value={l}>{REGION_LABEL[l]}</option>)}
            </select>
          </div>

          <div className="filter">
            <label>Período</label>
            <select value={timespan} onChange={(e) => setTimespan(e.target.value as any)}>
              {timespans.map((t) => <option key={t} value={t}>{t === "all" ? "All" : `${t} dias`}</option>)}
            </select>
          </div>

          <div className="filter grow">
            <label>Buscar</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome do player ou org (ex: aspas, LOUD)" />
          </div>
        </div>

        {loading ? <p className="muted">Carregando…</p> : null}

        <div className="grid-cards">
          {filtered.map((p) => (
            <Link key={`${p.player}__${p.org}`} href={`/jogadores/${encodeURIComponent(p.player)}?org=${encodeURIComponent(p.org ?? "")}&league=${league}&timespan=${timespan}`} className="card">
              <div className="card-title">{p.player}</div>
              <div className="card-subtitle">{p.org}</div>
              <div className="kpi-row">
                <span>Rating: <b>{p.rating}</b></span>
                <span>ACS: <b>{p.average_combat_score}</b></span>
                <span>K/D: <b>{p.kill_deaths}</b></span>
              </div>
            </Link>
          ))}
        </div>

        <p className="muted" style={{ marginTop: 16 }}>
          Dica: para “página individual” completa (agentes mais usados, classe automática e match do roster), a base já está pronta em <code>/jogadores/[id]</code>.
        </p>
      </div>
    </div>
  );
}
