import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <nav className="nav-container">
        <Link href="/" className="nav-logo">
          <img src="/killzone-logo.svg" alt="Killzone HUB" className="brand-icon" />
          <span>Killzone HUB</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="/times">Times</Link></li>
          <li><Link href="/jogadores">Jogadores</Link></li>
          <li><Link href="/ao-vivo">Ao Vivo</Link></li>
          <li><Link href="/eventos">Eventos</Link></li>
          <li><Link href="/noticias">Notícias</Link></li>
          <li><Link href="/ranking">Ranking</Link></li>
        </ul>

        <div className="nav-actions">
          <Link className="btn btn-secondary" href="/login">Login</Link>
        </div>
      </nav>
    </header>
  );
}
