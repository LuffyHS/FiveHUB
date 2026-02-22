import { Suspense } from "react";
import JogadoresContent from "./JogadoresContent";

export const dynamic = "force-dynamic";

export default function JogadoresPage() {
  return (
    <Suspense fallback={<div className="container"><p className="muted">Carregando…</p></div>}>
      <JogadoresContent />
    </Suspense>
  );
}
