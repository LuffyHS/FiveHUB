"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { calcRoleFromAgents, type Role } from "@/lib/role";

type PlayerRow = any;

function JogadorPageInner({ params }: { params: { id: string } }) {
  const sp = useSearchParams();
  const org = sp.get("org") ?? "";
  const league = sp.get("league") ?? "americas";
  const timespan = sp.get("timespan") ?? "30";

  const playerName = decodeURIComponent(params.id);

  const [row, setRow] = useState<PlayerRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgentRows] = useState<{ name: string; matches: number; usePct?: number }[]>([]);
  const [agentLoading, setAgentLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/stats?league=${league}&timespan=${timespan}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const players: PlayerRow[] = j.players ?? [];
        const found = players.find((p) =>
          String(p.player ?? "").toLowerCase() === playerName.toLowerCase() &&
          String(p.org ?? "").toLowerCase() === org.toLowerCase()
        ) ?? players.find((p) => String(p.player ?? "").toLowerCase() === playerName.toLowerCase());
        setRow(found ?? null);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [playerName, org, league, timespan]);

useEffect(() => {
  let alive = true;
  setAgentLoading(true);
  fetch(`/api/vlr/player/agents?player=${encodeURIComponent(playerName)}&org=${encodeURIComponent(org)}&timespan=${encodeURIComponent(timespan === "all" ? "all" : timespan + "d")}`)
    .then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    })
    .then((j) => {
      if (!alive) return;
      const agents = (j.agents ?? []).map((a: any) => ({
        name: String(a.agent ?? ""),
        matches: Number(a.useCount ?? 0),
        usePct: Number(a.usePct ?? 0),
      }));
      setAgentRows(agents);
    })
    .catch(() => alive && setAgentRows([]))
    .finally(() => alive && setAgentLoading(false));
  return () => { alive = false; };
}, [playerName, org, timespan]);

  const role: Role = useMemo(() => calcRoleFromAgents(agents.map(a => ({ name: a.name, matches: a.matches }))), [agents]);

  if (loading) return <div className="container"><p className="muted">Carregando…</p></div>;
  if (!row) return <div className="container"><p className="muted">Player não encontrado nessa liga/período.</p></div>;

  return (
    <div className="container">
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">{row.player}</h2>
          <p className="muted">{row.org} • {role}</p>
        </div>

        <div className="grid-cards">
          <div className="card">
            <div className="card-title">KPIs</div>
            <div className="kpi-row" style={{ marginTop: 10 }}>
              <span>Rating: <b>{row.rating}</b></span>
              <span>ACS: <b>{row.average_combat_score}</b></span>
              <span>K/D: <b>{row.kill_deaths}</b></span>
              <span>ADR: <b>{row.average_damage_per_round}</b></span>
              <span>KPR: <b>{row.kills_per_round}</b></span>
              <span>APR: <b>{row.assists_per_round}</b></span>
              <span>FKPR: <b>{row.first_kills_per_round}</b></span>
              <span>HS%: <b>{row.headshot_percentage}</b></span>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Agentes mais usados</div>
            <div className="card-subtitle">Scraper controlado (VLR.gg)</div>
            {agentLoading ? <p className="muted" style={{ marginTop: 10 }}>Carregando agents…</p> : null}
            {!agentLoading && agents.length === 0 ? <p className="muted" style={{ marginTop: 10 }}>Sem dados de agents para esse período (VLR).</p> : null}
            {agents.length > 0 ? (
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {agents.slice(0, 5).map((a) => (
                  <div key={a.name} className="kpi-row" style={{ justifyContent: "space-between" }}>
                    <span><b>{a.name}</b></span>
                    <span className="muted">{a.usePct ? `${a.usePct}%` : ""} • {a.matches} jogos</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="card">
            <div className="card-title">Time atual + roster</div>
            <div className="card-subtitle">Match inteligente por normalização</div>
            <p className="muted" style={{ marginTop: 10 }}>
              Para finalizar igual VLR: criar endpoint que resolve o <i>teamId</i> do player e retorna o roster do time (com cache no Redis).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JogadorPage(props: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="container"><p className="muted">Carregando…</p></div>}>
      <JogadorPageInner {...props} />
    </Suspense>
  );
}
