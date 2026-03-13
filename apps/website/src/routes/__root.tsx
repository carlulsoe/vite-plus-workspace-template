import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { siteConfig } from "../config/site";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: siteConfig.name,
      },
      {
        name: "description",
        content: siteConfig.description,
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: RootNotFound,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="text-ink antialiased">
        <div className="page-backdrop" aria-hidden="true" />
        <Header />
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}

function RootNotFound() {
  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] py-12 sm:py-16">
      <section className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 text-center shadow-panel sm:p-10">
        <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
          Route not found
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl font-display text-5xl leading-[0.92] tracking-[-0.04em] sm:text-7xl">
          The requested page is outside the current route tree.
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
          TanStack Router is now configured with an explicit root-level not found component, so bad
          paths resolve to a real app surface instead of the default fallback.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8c3f19,#c96c3c)] px-5 text-sm font-extrabold tracking-[0.04em] text-white no-underline"
          >
            Return to dashboard
          </Link>
          <Link
            to="/status"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/20 bg-white/70 px-5 text-sm font-extrabold tracking-[0.04em] text-ink no-underline"
          >
            Open status page
          </Link>
        </div>
      </section>
    </main>
  );
}
