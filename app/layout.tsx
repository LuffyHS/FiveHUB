import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "VAL Esports Hub",
  description: "Times Tier 1, pro players, ao vivo e stats — estilo VLR.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
