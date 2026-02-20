"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type PlayerRow = {
  name: string;
  org?: string;
  rating?: number;
  acs?: number;
  kd?: number;
  adr?: number;
  photo?: string | null;
};

const LEAGUES = [
  { key: "americas", label: "Americas" },
  { key: "emea", label: "EMEA" },
  { key: "pacific", label: "Pacific" },
  { key: "china", label: "China" },
];

const TIMESPANS = [
  { key: "30", label: "30 dias" },
  { key: "60", label: "60 dias" },
  { key: "90", label: "90 dias" },
  { key: "all", label: "All" },
];

function initials(name: string) {
  const s = (name || "").trim();
  if (!s) return "?";
  return s[0].toUpperCase();
}

export default function JogadoresContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const league = (sp.get("league") || "americas").toLowerCase();
  const timespan = (sp.get("timespan") || "30").toLowerCase();

  const [q, setQ] = useState(sp.get("q") || "");
  const [rows, setRows] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    params.set(key, value);
    router.push(`/jogadores?${params.toString()}`);
  }

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`/api/stats?league=${encodeURIComponent(league)}&timespan=${encodeURIComponent(timespan)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((j) => {
        if (!alive) return;
        const players = (j?.players || j?.data?.players || []) as any[];
        const normalized: PlayerRow[] = players
          .map((p: any) => ({
            name: p.player || p.name || p.handle || "",
            org: p.org || p.team || p.current_team || p.currentTeam,
            rating: typeof p.rating === "number" ? p.rating : (p.rating ? Number(p.rating) : undefined),
            acs: typeof p.acs === "number" ? p.acs : (p.acs ? Number(p.acs) : undefined),
            kd: typeof p.kd === "number" ? p.kd : (p.kd ? Number(p.kd) : undefined),
            adr: typeof p.adr === "number" ? p.adr : (p.adr ? Number(p.adr) : undefined),
            photo: p.img || p.image || p.photo || null,
          }))
          .filter((p) => p.name);

        setRows(normalized);
      })
      .catch((e) => {
        if (!alive) return;
        console.error(e);
        setRows([]);
        setError("Falha ao carregar jogadores. Tente novamente em alguns segundos.");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [league, timespan]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((p) => (p.name || "").toLowerCase().includes(query) || (p.org || "").toLowerCase().includes(query));
  }, [rows, q]);

  return (
    <div className="container">
      <div className="pageHeader">
        <h1>Jogadores</h1>
        <p className="muted">Tier 1 • filtros por liga e período • detalhes no perfil do jogador.</p>
      </div>

      <div className="filters">
        <div className="filterGroup">
          <label className="muted">Liga</label>
          <select value={league} onChange={(e) => setParam("league", e.target.value)}>
            {LEAGUES.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup">
          <label className="muted">Período</label>
          <select value={timespan} onChange={(e) => setParam("timespan", e.target.value)}>
            {TIMESPANS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup grow">
          <label className="muted">Buscar</label>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              const params = new URLSearchParams(sp.toString());
              params.set("q", e.target.value);
              router.replace(`/jogadores?${params.toString()}`);
            }}
            placeholder="Ex: aspas, TenZ, LOUD..."
          />
        </div>
      </div>

      {loading ? <p className="muted">Carregando…</p> : null}
      {error ? <p className="errorText">{error}</p> : null}
      {!loading && !error && filtered.length === 0 ? <p className="muted">Nenhum jogador encontrado.</p> : null}

      <div className="grid">
        {filtered.map((p) => (
          <a
            key={p.name}
            className="cardLink"
            href={`/jogadores/${encodeURIComponent(p.name)}?league=${encodeURIComponent(league)}&timespan=${encodeURIComponent(timespan)}&org=${encodeURIComponent(p.org ?? "")}`}
          >
            <div className="card playerRowCard">
              <div className="playerRowLeft">
                <div className="playerAvatar">
                  {p.photo ? <img src={`/api/img?url=${encodeURIComponent(p.photo)}`} alt={p.name} /> : initials(p.name)}
                </div>
              </div>
              <div className="playerRowBody">
                <div className="cardTitle">{p.name}</div>
                <div className="muted">{p.org || "—"}</div>
                <div className="kpis">
                  <span>Rating: <b>{p.rating?.toFixed?.(2) ?? "—"}</b></span>
                  <span>ACS: <b>{p.acs?.toFixed?.(1) ?? "—"}</b></span>
                  <span>K/D: <b>{p.kd?.toFixed?.(2) ?? "—"}</b></span>
                  <span>ADR: <b>{p.adr?.toFixed?.(1) ?? "—"}</b></span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <style jsx>{`
        .pageHeader { margin: 18px 0 14px; }
        .filters { display:flex; flex-wrap:wrap; gap:12px; margin: 14px 0 18px; }
        .filterGroup { display:flex; flex-direction:column; gap:6px; min-width: 180px; }
        .filterGroup.grow { flex: 1; min-width: 220px; }
        select, input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          border-radius: 12px;
          padding: 10px 12px;
          outline: none;
        }
        .grid { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }
        .playerRowCard{ display:flex; gap:12px; align-items:center; }
        .playerRowLeft{ flex:0 0 auto; }
        .playerRowBody{ flex:1; min-width:0; }
        .kpis { margin-top: 10px; display:flex; flex-wrap:wrap; gap:10px 14px; font-size: 13px; opacity: 0.95; }
        .errorText { color: #ff4d6d; }
        @media (max-width: 1050px){ .grid{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 650px){ .grid{ grid-template-columns: 1fr; } .filterGroup{ min-width: 140px; } }
      `}</style>
    </div>
  );
}
