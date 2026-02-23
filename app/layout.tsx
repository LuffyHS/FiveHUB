import "./globals.css";
import "./logo.css";
import Link from "next/link";
import ThemePanel from "@/components/ThemePanel";
import BackgroundLayer from "@/components/BackgroundLayer";

export const metadata = {
  title: "Killzone HUB Valorant",
  description: "Killzone HUB Valorant — Times Tier 1, jogadores, eventos e partidas (estilo VCT).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <BackgroundLayer />

        <header className="header">
          <div className="headerInner">
            <Link className="brand" href="/">
              <img
                src="/kz-logo.png"
                alt="KZ"
                className="brandLogoImg"
                width={44}
                height={44}
              />
              <div>
                <div style={{ fontWeight: 900, lineHeight: 1.1 }}>Killzone HUB</div>
                <div className="muted" style={{ fontSize: 12, lineHeight: 1.1 }}>
                  Valorant
                </div>
              </div>
            </Link>

            <nav className="nav">
              <Link href="/ao-vivo">Ao vivo</Link>
              <Link href="/times">Times</Link>
              <Link href="/jogadores">Jogadores</Link>
              <Link href="/eventos">Eventos</Link>
              <ThemePanel />
            </nav>
          </div>
        </header>

        {children}

        <footer className="container" style={{ opacity: 0.8, paddingTop: 10, paddingBottom: 26 }}>
          <div className="muted">© {new Date().getFullYear()} Killzone HUB Valorant</div>
        </footer>
      </body>
    </html>
  );
}
