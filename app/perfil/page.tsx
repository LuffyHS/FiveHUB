import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await readSession();
  if (!session) redirect("/login");

  const key = `riotid:${session.discordId}`;
  const riotId = await kv.get<string>(key);

  return (
    <div className="container">
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Perfil</h2>
          <p className="muted">Logado como {session.username}</p>
        </div>

        <div className="grid-cards">
          <div className="card">
            <div className="card-title">Seu Riot ID</div>
            <div className="card-subtitle">Salvo no Redis (Vercel KV)</div>
            <p style={{ marginTop: 10 }}>
              {riotId ? <b>{riotId}</b> : <span className="muted">Ainda não vinculado</span>}
            </p>

            <form action="/api/profile/riotid" method="post" style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input name="riotId" placeholder="Ex: SeuNick#BR1" defaultValue={riotId ?? ""} />
              <button className="btn btn-primary" type="submit">Salvar</button>
            </form>

            {riotId ? (
              <p className="muted" style={{ marginTop: 10 }}>
                Dica: você pode abrir seu perfil público no Tracker: <a className="link" href={`https://tracker.gg/valorant/profile/riot/${encodeURIComponent(riotId)}/overview`} target="_blank" rel="noreferrer">ver no Tracker.gg</a>
              </p>
            ) : null}
          </div>

          <div className="card">
            <div className="card-title">Sessão</div>
            <div className="card-subtitle">JWT + cookie httpOnly</div>
            <p className="muted" style={{ marginTop: 10 }}>
              Seu token expira em 30 dias e é renovado ao fazer login novamente.
            </p>
            <form action="/api/auth/logout" method="post" style={{ marginTop: 12 }}>
              <button className="btn btn-secondary" type="submit">Sair</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
