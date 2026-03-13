import { Link } from "@tanstack/react-router";
import { siteConfig } from "../config/site";

const navLinkClass =
  "rounded-full px-4 py-2 text-sm font-semibold tracking-[0.02em] text-ink-soft transition hover:-translate-y-0.5 hover:bg-white/70 hover:text-ink";

const navLinkActiveClass = `${navLinkClass} bg-white/80 text-ink shadow-sm`;

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/8 bg-[rgba(242,238,230,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-wrap items-center justify-between gap-4 py-4">
        <Link to="/" className="inline-flex items-center gap-4 no-underline">
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f7d1bf,transparent_35%),linear-gradient(135deg,#c96c3c,#de9a53,#1f7460)] shadow-[0_0_0_6px_rgba(201,108,60,0.12)]"
          />
          <span>
            <strong className="block text-base tracking-[0.01em] text-ink">
              {siteConfig.name}
            </strong>
            <small className="block text-[0.72rem] uppercase tracking-[0.18em] text-ink-muted">
              Morning allocation desk
            </small>
          </span>
        </Link>

        <nav className="flex flex-wrap gap-2" aria-label="Primary">
          <Link to="/" className={navLinkClass} activeProps={{ className: navLinkActiveClass }}>
            Dashboard
          </Link>
          <Link
            to="/status"
            className={navLinkClass}
            activeProps={{ className: navLinkActiveClass }}
          >
            Status
          </Link>
          <a href="/api/health" className={navLinkClass} target="_blank" rel="noreferrer">
            API Health
          </a>
        </nav>
      </div>
    </header>
  );
}
