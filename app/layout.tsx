import type { Metadata } from "next";
import "./globals.css";
import ThemePanel from "@/components/ThemePanel";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FiveHUB",
  description: "FiveHUB — partidas ao vivo, times Tier 1, pro players, ranking e stats.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="red">
      <body>
        <Header />
        <main className="main relative z-[1]">{children}</main>
        <Footer />
        <ThemePanel />
</body>
    </html>
  );
}
