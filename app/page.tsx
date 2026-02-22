import { Section } from "@/components/Section";
import { getRankings } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function TimePage({ params }: { params: { id: string } }) {
  const teamId = decodeURIComponent(params.id);

  // Best-effort: encontra em 'all' (ou pode ajustar para região depois)
  const rk = await getRankings("all");
  const rows = ((rk as any)?.data ?? []) as any[];

  const team =
    rows.find((r: any) => String(r?.team_name || "").toLowerCase() === teamId.toLowerCase()) ||
    rows.find((r: any) => String(r?.team_name || "").toLowerCase().includes(teamId.toLowerCase())) ||
    { team_name: teamId, team_logo: null };

  return (
    <div className="container">
      <Section title={team?.team_name || "Time"}>
        <div className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div className="playerAvatar" style={{ width: 88, height: 88, borderRadius: 22 }}>
            {team?.team_logo ? <img src={team.team_logo} alt={team.team_name} /> : (team?.team_name?.[0] || "?")}
          </div>
          <div>
            <h1 style={{ margin: 0 }}>{team?.team_name}</h1>
            <p className="muted" style={{ margin: "6px 0 0" }}>
              Rank #{team?.rank ?? "—"} • Points {team?.points ?? "—"}
            </p>
          </div>
        </div>

        <div style={{ height: 16 }} />

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Últimas partidas</h2>
          <p className="muted">
            Em breve: integração de histórico completo e map pool (W/L/WR). (Build-safe placeholder)
          </p>
        </div>
      </Section>
    </div>
  );
}
