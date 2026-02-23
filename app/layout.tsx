import "./globals.css";
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
              <div className="brandLogo">KZ</div>
              <div>
                <div style={{ fontWeight: 900, lineHeight: 1.1 }}>Killzone HUB</div>
                <div className="muted" style={{ fontSize: 12, lineHeight: 1.1 }}>Valorant</div>
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

        <style jsx global>{`
          .kz-bg{
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            opacity: var(--kzOpacity, 0.85);
          }
          .kz-vct{
            background:
              radial-gradient(900px 360px at 10% 10%, rgba(var(--accent),0.30), transparent 60%),
              radial-gradient(700px 320px at 85% 18%, rgba(var(--accent2),0.22), transparent 60%),
              radial-gradient(900px 360px at 30% 90%, rgba(var(--accent),0.16), transparent 65%),
              linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.00));
          }
          .kz-vct::after{
            content:"";
            position:absolute; inset:-120px;
            background:
              repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 10px);
            opacity: .35;
            transform: rotate(10deg);
            animation: kzMove 12s linear infinite;
          }
          .kz-grid{
            background:
              radial-gradient(900px 360px at 10% 10%, rgba(var(--accent),0.22), transparent 60%),
              linear-gradient(transparent 0 0),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 64px),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 64px);
          }
          .kz-noise{
            background:
              radial-gradient(900px 360px at 10% 10%, rgba(var(--accent),0.24), transparent 60%),
              radial-gradient(700px 320px at 85% 18%, rgba(var(--accent2),0.20), transparent 60%),
              linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.00));
          }
          .kz-noise::after{
            content:"";
            position:absolute; inset:0;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E");
            mix-blend-mode: overlay;
            opacity: .55;
          }
          .kz-none{ background: none; }

          @keyframes kzMove{
            0%{ transform: translateX(-60px) rotate(10deg); }
            100%{ transform: translateX(60px) rotate(10deg); }
          }

          @media (prefers-reduced-motion: reduce){
            .kz-vct::after{ animation: none !important; }
          }
        `}</style>
      </body>
    </html>
  );
}
