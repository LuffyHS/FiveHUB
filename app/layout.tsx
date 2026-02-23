
import "./globals.css";
import ChampionsBackground from "@/components/ChampionsBackground";

export const metadata = {
  title: "Killzone HUB Pro",
  description: "Competitive Valorant Hub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ChampionsBackground />
        {children}
      </body>
    </html>
  );
}
