import { NextResponse } from "next/server";
import { getPlayerAgentsFromVLR } from "@/lib/vlrScraper";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get("player") || "";
  const event = searchParams.get("event") || undefined;
  const timespan = searchParams.get("timespan") || undefined;

  if (!player) {
    return NextResponse.json({ ok: false, error: "Missing player" }, { status: 400 });
  }

  const agents = await getPlayerAgentsFromVLR({ playerUrlOrId: player, event, timespan });
  return NextResponse.json({ ok: true, player, event, timespan, agents });
}
