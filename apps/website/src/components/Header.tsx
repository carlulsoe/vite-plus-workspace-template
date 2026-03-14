import { Link } from "@tanstack/react-router";
import { Cpu, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navLinkClass = cn(
  buttonVariants({ variant: "ghost", size: "sm" }),
  "rounded-full px-5 text-sm font-semibold tracking-wide text-ink-soft hover:-translate-y-0.5 transition-all duration-300",
);

const navLinkActiveClass = cn(
  buttonVariants({ variant: "secondary", size: "sm" }),
  "rounded-full px-5 text-sm font-bold tracking-wide text-ink shadow-md bg-white dark:bg-white/10",
);

export default function Header() {
  return (
    <header className="glass-header border-b-0 shadow-sm">
      <div className="mx-auto flex w-[min(1280px,calc(100%-4rem))] flex-wrap items-center justify-between gap-6 py-6">
        <Link to="/" className="inline-flex items-center gap-5 no-underline group">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-chart-2 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3">
              <Cpu className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="grid gap-1">
            <strong className="block text-xl tracking-tighter text-ink font-display">
              {siteConfig.name}
            </strong>
            <Badge
              variant="outline"
              className="rounded-full px-2 py-0 text-[0.6rem] tracking-[0.2em] uppercase text-ink-muted border-primary/20 bg-primary/5 font-black"
            >
              Shared core starter
            </Badge>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-3" aria-label="Primary">
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
          <div className="h-4 w-px bg-black/5 dark:bg-white/5 mx-2" />
          <a
            href="/api/health"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full px-5 text-xs font-black uppercase tracking-widest border-primary/20 hover:bg-primary/5 transition-colors flex items-center gap-2",
            )}
            target="_blank"
            rel="noreferrer"
          >
            API Health
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>
      </div>
    </header>
  );
}
