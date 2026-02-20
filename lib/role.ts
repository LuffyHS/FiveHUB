export type Role = "Duelista" | "Iniciador" | "Controlador" | "Sentinela" | "Flex";

const AGENT_ROLE: Record<string, Role> = {
  // Duelistas
  "Jett": "Duelista",
  "Raze": "Duelista",
  "Reyna": "Duelista",
  "Phoenix": "Duelista",
  "Yoru": "Duelista",
  "Neon": "Duelista",
  "Iso": "Duelista",

  // Iniciadores
  "Sova": "Iniciador",
  "Breach": "Iniciador",
  "Skye": "Iniciador",
  "KAY/O": "Iniciador",
  "Fade": "Iniciador",
  "Gekko": "Iniciador",

  // Controladores
  "Omen": "Controlador",
  "Brimstone": "Controlador",
  "Viper": "Controlador",
  "Astra": "Controlador",
  "Harbor": "Controlador",
  "Clove": "Controlador",

  // Sentinelas
  "Killjoy": "Sentinela",
  "Cypher": "Sentinela",
  "Sage": "Sentinela",
  "Chamber": "Sentinela",
  "Deadlock": "Sentinela",
  "Vyse": "Sentinela",
};

export function calcRoleFromAgents(agents: { name: string; matches?: number }[]): Role {
  const counts: Record<Role, number> = {
    Duelista: 0,
    Iniciador: 0,
    Controlador: 0,
    Sentinela: 0,
    Flex: 0,
  };

  for (const a of agents) {
    const role = AGENT_ROLE[a.name] ?? "Flex";
    counts[role] += a.matches ?? 1;
  }

  // dominant role
  const sorted = (Object.keys(counts) as Role[])
    .filter(r => r !== "Flex")
    .map(r => ({ role: r, v: counts[r] }))
    .sort((x, y) => y.v - x.v);

  if (sorted.length === 0 || sorted[0].v === 0) return "Flex";

  // if top is not clearly dominant, call it Flex
  const top = sorted[0];
  const second = sorted[1];
  if (second && top.v / Math.max(1, second.v) < 1.25) return "Flex";

  return top.role;
}
