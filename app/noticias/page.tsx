import { Section } from "@/components/Section";
import { getNews } from "@/lib/vlrggapi";

export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const data = await getNews();
  const news = data?.data?.segments ?? [];

  return (
    <div className="container">
      <Section title="Notícias (automáticas)">
        <div className="grid-cards">
          {news.slice(0, 24).map((n: any, idx: number) => (
            <a key={idx} className="card" href={n.url_path} target="_blank" rel="noreferrer">
              <div className="card-title">{n.title}</div>
              <div className="card-subtitle">{n.date} • {n.author}</div>
              <p className="muted" style={{ marginTop: 10 }}>{n.description}</p>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}