import { Section } from "@/components/Section";
import { getTeam } from "@/lib/vlrOrlandomm";

function pickLogo(logo?: string) {
  if (!logo) return "/placeholder-team.svg";
  return `/api/img?url=${encodeURIComponent(logo.startsWith("http") ? logo : `https:${logo}`)}`;
}

export default async function TimePage({ params }: { params: { id: string } }) {
  const data = await getTeam(params.id);
  const team = data?.data ?? data?.team ?? data;

  return (
    <div className="container">
      <Section title={team?.name ?? "Time"}>
        <div className="team-hero">
          <img className="team-logo" alt={team?.name ?? "Logo"} src={pickLogo(team?.logo)} />
          <div>
            <p className="muted">{team?.country ?? team?.region ?? ""}</p>
            {team?.url && (
              <p>
                <a className="link" href={team.url} target="_blank" rel="noreferrer">Ver no VLR</a>
              </p>
            )}
          </div>
        </div>

        <div className="grid-cards" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="card-title">Estatísticas por mapa</div>
            <div className="card-subtitle">Picks, bans, W/L, winrate</div>
            <p className="muted" style={{ marginTop: 10 }}>
              A API do orlandomm entrega dados básicos do time. Para stats por mapa/picks/bans como o VLR, este projeto
              já está preparado para plugar um scraper/endpoint dedicado (ex: seu próprio worker/cron + Redis).
            </p>
          </div>

          <div className="card">
            <div className="card-title">Elenco (auto)</div>
            <div className="card-subtitle">Match com VLR + roster</div>
            <p className="muted" style={{ marginTop: 10 }}>
              Se o payload da API trouxer roster, mostramos aqui. Caso contrário, você pode habilitar via integração
              com endpoints de elenco e cache.
            </p>
          </div>
        </div>

        {Array.isArray(team?.players) && team.players.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <h3>Roster</h3>
            <ul>
              {team.players.map((p: any) => (
                <li key={String(p.id ?? p.name)}>{p.name}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>
    </div>
  );
}
