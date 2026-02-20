import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container">
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Login com Discord</h2>
          <p className="muted">Login é opcional: só é necessário para salvar seu Riot ID e favoritos.</p>
        </div>

        <a className="btn btn-primary" href="/api/auth/discord">Entrar com Discord</a>

        <p className="muted" style={{ marginTop: 12 }}>
          Ao entrar, você concorda com o uso de cookies de sessão (httpOnly) para manter seu login.
        </p>

        <p style={{ marginTop: 18 }}>
          <Link className="link" href="/">Voltar para Home</Link>
        </p>
      </div>
    </div>
  );
}
