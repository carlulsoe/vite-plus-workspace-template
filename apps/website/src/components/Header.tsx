import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navLinkClass = cn(
  buttonVariants({ variant: "ghost", size: "sm" }),
  "rounded-full px-4 text-sm tracking-[0.02em] text-ink-soft hover:-translate-y-0.5",
);

const navLinkActiveClass = cn(
  buttonVariants({ variant: "secondary", size: "sm" }),
  "rounded-full px-4 text-sm tracking-[0.02em] text-ink shadow-sm",
);

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/8 bg-[rgba(242,238,230,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-wrap items-center justify-between gap-4 py-4">
        <Link to="/" className="inline-flex items-center gap-4 no-underline">
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f7d1bf,transparent_35%),linear-gradient(135deg,#c96c3c,#de9a53,#1f7460)] shadow-[0_0_0_6px_rgba(201,108,60,0.12)]"
          />
          <span className="grid gap-1">
            <strong className="block text-base tracking-[0.01em] text-ink">
              {siteConfig.name}
            </strong>
            <Badge
              variant="outline"
              className="rounded-full px-2.5 py-0 text-[0.68rem] tracking-[0.18em] uppercase text-ink-muted"
            >
              Morning allocation desk
            </Badge>
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
          <a
            href="/api/health"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full px-4 text-sm tracking-[0.02em]",
            )}
            target="_blank"
            rel="noreferrer"
          >
            API Health
          </a>
        </nav>
      </div>
    </header>
  );
}
