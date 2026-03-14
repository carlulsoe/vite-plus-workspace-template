import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Fingerprint,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import type { StatusData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export interface StatusPageProps {
  data: StatusData;
}

export function StatusPage({ data }: StatusPageProps) {
  const { health, snapshot } = data;
  const isOperational = health.status.toLowerCase() === "operational";

  return (
    <main className="section-container py-12 pb-24">
      {/* Page Header */}
      <section className="reveal-up">
        <Card className="card-section border-0 bg-primary/5 dark:bg-primary/10 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="h-48 w-48 text-primary" />
          </div>
          <CardContent className="flex flex-col gap-12 p-10 sm:p-16 sm:flex-row sm:items-center sm:justify-between relative z-10">
            <div className="space-y-6 max-w-2xl">
              <Badge variant="outline" className="badge-section flex items-center gap-1.5 w-fit">
                <Activity className="h-3 w-3" />
                Operational view
              </Badge>
              <h1 className="text-6xl leading-[0.9] sm:text-8xl lg:text-9xl font-display">
                System <span className="text-primary italic">Live</span> Status.
              </h1>
              <p className="text-xl text-ink-soft leading-relaxed font-medium">
                Real-time monitoring of shared package logic, Nitro-backed routes, and core domain
                service health.
              </p>
            </div>

            <div
              className={cn(
                "flex flex-col items-center justify-center p-10 rounded-[3rem] border-4 aspect-square min-w-[240px] transition-all duration-700 shadow-2xl",
                isOperational
                  ? "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10"
                  : "bg-destructive/10 border-destructive/20 shadow-destructive/10",
              )}
            >
              <div
                className={cn(
                  "h-6 w-6 rounded-full mb-6 animate-pulse",
                  isOperational
                    ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                    : "bg-destructive shadow-[0_0_20px_rgba(224,108,77,0.6)]",
                )}
              />
              <strong
                className={cn(
                  "text-3xl font-black uppercase tracking-[0.2em] leading-none",
                  isOperational ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
                )}
              >
                {health.status}
              </strong>
              <div className="flex items-center gap-2 mt-3">
                <p className="text-[0.7rem] font-black text-ink-muted uppercase tracking-[0.2em]">
                  Status
                </p>
                <div className="h-1 w-8 bg-ink-muted/20 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Runtime Signals */}
        <section className="reveal-up [animation-delay:100ms] space-y-8">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-3">
              <Badge variant="outline" className="badge-section flex items-center gap-1.5 w-fit">
                <Cpu className="h-3 w-3" />
                Diagnostics
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-display">Runtime signals</h2>
            </div>
            <div className="flex items-center gap-2 text-ink-muted">
              <Clock className="h-3.5 w-3.5" />
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                Last check: {health.checkedAt}
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {health.checks.map((check, idx) => (
              <Card
                key={check.label}
                className="card-nested group hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                <CardContent className="p-8 flex items-start gap-8">
                  <div className="h-16 w-16 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                    {idx === 0 && <CheckCircle2 className="h-7 w-7 text-emerald-500" />}
                    {idx === 1 && <Fingerprint className="h-7 w-7 text-emerald-500" />}
                    {idx === 2 && <Layers className="h-7 w-7 text-emerald-500" />}
                    {idx > 2 && <Activity className="h-7 w-7 text-emerald-500" />}
                  </div>
                  <div className="space-y-2 pt-1">
                    <strong className="text-2xl text-ink font-display block group-hover:text-primary transition-colors">
                      {check.label}
                    </strong>
                    <p className="text-base leading-relaxed text-ink-soft font-medium">
                      {check.detail}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-12">
          <section className="reveal-up [animation-delay:200ms] space-y-8">
            <div className="px-2 space-y-3">
              <Badge variant="outline" className="badge-section flex items-center gap-1.5 w-fit">
                <Fingerprint className="h-3 w-3" />
                Architecture
              </Badge>
              <h2 className="text-4xl font-display">Imported patterns</h2>
            </div>

            <div className="space-y-6">
              {siteConfig.operatingPrinciples.map((principle) => (
                <Card
                  key={principle}
                  size="sm"
                  className="card-section border-0 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/5 transition-all duration-500"
                >
                  <CardContent className="p-8 space-y-6">
                    <Badge
                      variant="outline"
                      className="badge-section border-primary/20 text-primary bg-primary/5 px-3 py-1"
                    >
                      Principle
                    </Badge>
                    <p className="text-lg font-bold leading-relaxed text-ink-soft italic font-display">
                      "{principle}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="reveal-up [animation-delay:300ms]">
            <Card className="card-section border-0 shadow-2xl overflow-hidden group">
              <CardHeader className="p-10 pb-0">
                <div className="space-y-3">
                  <Badge
                    variant="outline"
                    className="badge-section flex items-center gap-1.5 w-fit"
                  >
                    <Activity className="h-3 w-3" />
                    Footprint
                  </Badge>
                  <h2 className="text-3xl font-display">Signal core snapshot</h2>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="space-y-4">
                  {snapshot.watchlist.map((instrument) => (
                    <div
                      key={instrument.id}
                      className="flex items-center justify-between p-5 rounded-3xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:border-primary/20 transition-all duration-300 group/item"
                    >
                      <div className="space-y-1">
                        <p className="text-base font-bold text-ink group-hover/item:text-primary transition-colors">
                          {instrument.label}
                        </p>
                        <p className="text-[0.7rem] font-black text-ink-muted uppercase tracking-widest flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-primary/40" />
                          {instrument.symbol}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-ink tracking-tighter">
                          {instrument.signal}
                        </p>
                        <ChevronRight className="h-3 w-3 text-ink-muted/40 ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </aside>
      </div>
    </main>
  );
}
