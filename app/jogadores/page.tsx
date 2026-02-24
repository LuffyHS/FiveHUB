"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { calcRoleFromAgents, type Role } from "@/lib/role";

type PlayerRow = any;

export default function JogadorPage({ params }: { params: { id: string } }) {
  const sp = useSearchParams();
  const org = sp.get("org") ?? "";
  const league = sp.get("league") ?? "americas";
  const timespan = sp.get("timespan") ?? "30";

  const playerName = decodeURIComponent(params.id);

  const [row, setRow] = useState<PlayerRow | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Placeholder agent usage: plug your own endpoint later
  const agents = useMemo(() => {
    return [] as { name: string; matches: number }[];
  }, []);

  const role: Role = useMemo(() => calcRoleFromAgents(agents), [agents]);

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
            <div className="card-subtitle">Preparado para plugar endpoint de agents (VLR-like)</div>
            {agents.length === 0 ? <p className="muted" style={{ marginTop: 10 }}>Ainda não conectado. Quando você tiver o endpoint, o Role vira 100% automático.</p> : null}
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
