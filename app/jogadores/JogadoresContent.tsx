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

export default function JogadoresContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(sp.get("q") || "");
  const [rows, setRows] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetch(`/api/stats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!alive) return;
        const players = (j?.players || j?.data?.players || []) as any[];
        const mapped: PlayerRow[] = players
          .map((p: any) => ({
            name: p.player || p.name || p.handle || "",
            org: p.org || p.team || p.current_team || p.currentTeam,
            rating: p.rating ? Number(p.rating) : undefined,
            acs: p.acs ? Number(p.acs) : undefined,
            kd: p.kd ? Number(p.kd) : undefined,
            adr: p.adr ? Number(p.adr) : undefined,
            photo: p.photo || p.player_photo || null,
          }))
          .filter((x) => x.name);

        setRows(mapped);
      })
      .catch(() => alive && setRows([]))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(query) ||
        (p.org || "").toLowerCase().includes(query)
    );
  }, [rows, q]);

  return (
    <div className="container">
      <h1>Jogadores</h1>
      <p className="muted">Busca com avatar premium. (Dados via /api/stats)</p>

      <div style={{ display: "flex", gap: 12, margin: "12px 0 18px", flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            const params = new URLSearchParams(sp.toString());
            params.set("q", e.target.value);
            router.replace(`/jogadores?${params.toString()}`);
          }}
          placeholder="Buscar jogador…"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            borderRadius: 12,
            padding: "10px 12px",
            outline: "none",
            minWidth: 240,
          }}
        />
      </div>

      {loading ? <p className="muted">Carregando…</p> : null}
      {!loading && filtered.length === 0 ? <p className="muted">Nenhum jogador encontrado.</p> : null}

      <div className="grid cols3">
        {filtered.map((p) => (
          <a key={p.name} className="cardLink" href={`/jogadores/${encodeURIComponent(p.name)}`}>
            <div className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="playerAvatar">
                {p.photo ? <img src={p.photo} alt={p.name} /> : (p.name[0] || "?").toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
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
    </div>
  );
}
