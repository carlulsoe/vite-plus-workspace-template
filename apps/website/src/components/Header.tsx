import { Link } from "@tanstack/react-router";
import { siteConfig } from "../config/site";

export default function Header() {
  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <Link to="/" className="brand-mark">
          <span className="brand-mark__dot" aria-hidden="true" />
          <span>
            <strong>{siteConfig.name}</strong>
            <small>Morning allocation desk</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <Link
            to="/"
            className="site-nav__link"
            activeProps={{ className: "site-nav__link is-active" }}
          >
            Dashboard
          </Link>
          <Link
            to="/status"
            className="site-nav__link"
            activeProps={{ className: "site-nav__link is-active" }}
          >
            Status
          </Link>
          <a href="/api/health" className="site-nav__link" target="_blank" rel="noreferrer">
            API Health
          </a>
        </nav>
      </div>
    </header>
  );
}
