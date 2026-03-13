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
      <body>
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
    <main className="page-shell not-found-page">
      <section className="surface-card not-found-card">
        <p className="eyebrow">Route not found</p>
        <h1>The requested page is outside the current route tree.</h1>
        <p className="hero-copy">
          TanStack Router is now configured with an explicit root-level not found component, so bad
          paths resolve to a real app surface instead of the default fallback.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="primary-link">
            Return to dashboard
          </Link>
          <Link to="/status" className="secondary-link">
            Open status page
          </Link>
        </div>
      </section>
    </main>
  );
}
