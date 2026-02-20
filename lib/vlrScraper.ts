import * as cheerio from "cheerio";

export type Timespan = "30d" | "60d" | "90d" | "all";

export type PlayerAgentRow = {
  agent: string;
  useCount: number;
  usePct: number; // 0-100
  rounds: number;
  rating: number | null;
  acs: number | null;
  kd: number | null;
  adr: number | null;
  kastPct: number | null; // 0-100
};

export type PlayerAgentsResult = {
  vlrPlayerUrl: string;
  displayName: string;
  org?: string;
  timespan: Timespan;
  agents: PlayerAgentRow[];
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36 FiveHUB/2.5";

function toNumber(s: string): number | null {
  const cleaned = s.replace(/[%(),]/g, "").trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function pickFirst<T>(arr: T[]): T | undefined {
  return arr.length ? arr[0] : undefined;
}

export async function resolveVlrPlayerUrlBySearch(q: string, orgHint?: string): Promise<string | null> {
  const url = `https://www.vlr.gg/search/?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" } });
  if (!res.ok) return null;
  const html = await res.text();
  const $ = cheerio.load(html);

  const links = $("a[href^='/player/']")
    .map((_, el) => $(el).attr("href"))
    .get()
    .filter(Boolean) as string[];

  if (!links.length) return null;

  // If org hint exists, try to find a row that contains the org hint nearby
  if (orgHint) {
    const hint = orgHint.toLowerCase();
    for (const href of links) {
      const el = $(`a[href='${href}']`).first();
      const ctx = el.parent().text().toLowerCase();
      if (ctx.includes(hint)) return `https://www.vlr.gg${href}`;
    }
  }

  // fallback: first player link
  return `https://www.vlr.gg${links[0]}`;
}

export async function fetchPlayerAgents(vlrPlayerUrl: string, timespan: Timespan): Promise<PlayerAgentsResult> {
  const url = vlrPlayerUrl.includes("?")
    ? `${vlrPlayerUrl}&timespan=${timespan}`
    : `${vlrPlayerUrl.replace(/\/$/, "")}/?timespan=${timespan}`;

  const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" } });
  if (!res.ok) {
    throw new Error(`VLR fetch failed: ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);

  const displayName = $("h1").first().text().trim() || qFromUrl(vlrPlayerUrl) || "Player";
  const agents: PlayerAgentRow[] = [];

  // Most VLR tables are <table> with rows <tr>
  const rows = $("table tr").toArray();

  for (const tr of rows) {
    const row = $(tr);

    const imgAlt = row.find("img").first().attr("alt") || "";
    const agent = imgAlt.trim();
    if (!agent) continue;

    const tds = row.find("td").toArray().map((td) => $(td).text().replace(/\s+/g, " ").trim());
    if (tds.length < 5) continue;

    // VLR agent row format begins with something like: "(9) 45%" in first cell after image.
    // However sometimes the first TD may include both count and pct.
    // We'll join all td texts and parse sequentially based on the header order.
    // Expected order after agent: Use(count+%), RND, Rating 2.0, ACS, K:D, ADR, KAST ...
    const joined = tds.join(" | ");

    // Extract use count and percent from joined text
    const useCountMatch = joined.match(/\((\d+)\)/);
    const usePctMatch = joined.match(/\)\s*(\d+)%/);
    const useCount = useCountMatch ? Number(useCountMatch[1]) : 0;
    const usePct = usePctMatch ? Number(usePctMatch[1]) : 0;

    // Remove the "(n) xx%" part from first cell for easier parsing
    // We'll instead read subsequent numeric columns from tds by scanning numbers.
    // Build numeric tokens from row text excluding agent name
    const textNoAgent = row.text().replace(agent, " ").replace(/\s+/g, " ").trim();

    // Tokenize by spaces and keep tokens that contain digits or % or dot
    const tokens = textNoAgent.split(" ").filter((tok) => /\d/.test(tok));
    // tokens start with count and pct, then rounds, rating, acs, kd, adr, kast%, ...
    // Example: (9) 45% 195 1.05 219.1 1.09 137.4 72% ...
    const numbers = tokens
      .map((tok) => tok.trim())
      .map((tok) => tok.replace(/^\(|\)$/g, "")); // strip parentheses

    const rounds = toNumber(numbers[2] ?? "") ?? 0;
    const rating = toNumber(numbers[3] ?? "");
    const acs = toNumber(numbers[4] ?? "");
    const kd = toNumber(numbers[5] ?? "");
    const adr = toNumber(numbers[6] ?? "");
    const kastPct = toNumber(numbers[7] ?? "");

    agents.push({
      agent,
      useCount,
      usePct,
      rounds,
      rating,
      acs,
      kd,
      adr,
      kastPct
    });
  }

  // If the table parsing above fails due to structure changes, fall back to parsing lines that contain Image: agent
  if (!agents.length) {
    $("img[alt]")
      .toArray()
      .forEach((img) => {
        const alt = $(img).attr("alt")?.trim();
        if (!alt) return;
        // heuristic: agent icons are lowercase names and appear inside Agents section. Hard to detect reliably.
      });
  }

  return {
    vlrPlayerUrl: url,
    displayName,
    timespan,
    agents
  };
}

function qFromUrl(u: string): string | null {
  const m = u.match(/\/player\/\d+\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
