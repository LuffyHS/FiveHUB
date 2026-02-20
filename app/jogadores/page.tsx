import { Suspense } from "react"
import JogadoresContent from "./JogadoresContent"

export default function Page() {
  return (
    <Suspense fallback={<div className="container"><p className="muted">Carregando…</p></div>}>
      <JogadoresContent />
    </Suspense>
  )
}
