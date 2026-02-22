// Build-safe stub: scraper controlado será implementado depois.
// Importante: NÃO depende de cheerio para não quebrar build na Vercel.

export type AgentStat = {
  agent: string;
  maps: number;
  pickPct?: number;
  winPct?: number;
  rating?: number;
  acs?: number;
  kd?: number;
  adr?: number;
};

export async function getPlayerAgentsFromVLR(params: {
  playerUrlOrId: string;
  event?: string;
  timespan?: string;
}): Promise<AgentStat[]> {
  // Placeholder: retornar vazio por enquanto
  return [];
}
