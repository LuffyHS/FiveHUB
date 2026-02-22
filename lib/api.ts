export const VLR_BASE = "https://vlrggapi.vercel.app";

async function safeJson(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getRankings(region: string) {
  return safeJson(`${VLR_BASE}/rankings?region=${encodeURIComponent(region)}`);
}
