import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "Bad url" }, { status: 400 });
  }

  if (target.protocol !== "https:") {
    return NextResponse.json({ error: "Only https allowed" }, { status: 400 });
  }

  const res = await fetch(target.toString(), {
    headers: {
      // a little anti-hotlink friendliness
      "User-Agent": "VAL-Esports-Hub/1.0 (+vercel)",
      "Accept": "image/*,*/*;q=0.8",
      "Referer": "https://www.vlr.gg/",
    },
    // let Vercel cache
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) return NextResponse.json({ error: "Upstream error" }, { status: 502 });

  const buf = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") ?? "image/png";

  return new NextResponse(buf, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
