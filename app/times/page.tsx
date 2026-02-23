import Link from "next/link";
import { getRankings } from "@/lib/api";

export const dynamic = "force-dynamic";

const REGIONS = [
  { key: "na", label: "Americas" },
  { key: "eu", label: "EMEA" },
  { key: "ap", label: "Pacific" },
  { key: "cn", label: "China" },
];

export default async function TimesPage() {
  const results = await Promise.all(
    REGIONS.map(async (r) => {
      const data = await getRankings(r.key);
      const teams = (data?.data ?? data?.segments ?? []) as any[];
      return { ...r, teams };
    })
  );

  return (
    <main className="container">
      <h1 style={{ marginTop: 6 }}>Times Tier 1</h1>
      <p className="muted">Selecione uma região. (Se a fonte estiver instável, aparece fallback.)</p>

      {results.map((r) => (
        <section key={r.key} style={{ marginTop: 18 }}>
          <h2 style={{ margin: "10px 0" }}>{r.label}</h2>
          {!r.teams?.length ? (
            <div className="card"><p className="muted">Sem dados no momento.</p></div>
          ) : (
            <div className="grid cols4">
              {r.teams.slice(0, 24).map((t: any, i: number) => {
                const name = t?.team_name || t?.name || "Time";
                const logo = t?.team_logo || t?.logo || null;
                const rank = t?.rank ?? t?.position ?? "—";
                const rating = t?.rating ?? "—";
                return (
                  <Link key={name + i} className="cardLink" href={`/times/${encodeURIComponent(name)}`}>
                    <div className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div className="playerAvatar" style={{ width: 54, height: 54, borderRadius: 16 }}>
                        {logo ? <img src={logo} alt={name} /> : (name[0] || "?").toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="cardTitle">{name}</div>
                        <div className="muted">#{rank} • Rating: {rating}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
