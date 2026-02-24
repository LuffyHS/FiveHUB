import Link from "next/link";
import { Section } from "@/components/Section";
import { getTeamMatches } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function TimeHistoricoPage({
  params,
}: {
  params: { id: string };
}) {
  const teamId = decodeURIComponent(params.id);

  // Best-effort: tenta buscar partidas do time, mas nunca quebra build se a fonte falhar
  const data = await getTeamMatches(teamId);
  const matches = (data?.data?.segments ?? data?.data?.matches ?? data?.data ?? data ?? []) as any[];

  return (
    <div className="container">
      <Section title={`Histórico • ${teamId}`}>
        <div className="breadcrumbs">
          <Link href={`/times/${encodeURIComponent(teamId)}`} className="muted">
            ← Voltar ao time
          </Link>
        </div>

        <h1 style={{ marginTop: 10 }}>Histórico</h1>
        <p className="muted">Últimas partidas registradas para este time (best-effort).</p>

        {!matches?.length ? (
          <div className="card" style={{ marginTop: 14 }}>
            <p className="muted">
              Ainda não conseguimos carregar o histórico desse time pela fonte atual.
              (Isso não quebra o deploy. Próximo passo: integrar endpoint dedicado por time
              + cache.)
            </p>
          </div>
        ) : (
          <div className="grid" style={{ marginTop: 14 }}>
            {matches.slice(0, 50).map((m: any, i: number) => {
              const title =
                m?.title ||
                m?.match ||
                `${m?.team1 ?? ""} vs ${m?.team2 ?? ""}`.trim() ||
                "Partida";
              const meta = m?.event || m?.tournament || m?.time || m?.date || "";
              return (
                <div key={m?.id ?? m?.match_id ?? i} className="card">
                  <div className="cardTitle">{title}</div>
                  <div className="muted">{meta || "—"}</div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
