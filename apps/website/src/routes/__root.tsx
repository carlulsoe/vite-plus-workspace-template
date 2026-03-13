import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import appCss from "@/styles.css?url";

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
      <body className="text-foreground antialiased">
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
      <Card className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 text-center shadow-panel">
        <CardHeader className="justify-items-center px-6 pt-6 sm:px-10 sm:pt-10">
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted"
          >
            Route not found
          </Badge>
          <h1 className="mx-auto mt-3 max-w-4xl font-display text-5xl leading-[0.92] tracking-[-0.04em] text-ink sm:text-7xl">
            The requested page is outside the current route tree.
          </h1>
          <CardDescription className="mx-auto mt-2 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
            TanStack Router is now configured with an explicit root-level not found component, so
            bad paths resolve to a real app surface instead of the default fallback.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-10">
          <div className="mt-2 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-5 text-sm tracking-[0.04em] no-underline",
              )}
            >
              Return to dashboard
            </Link>
            <Link
              to="/status"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-5 text-sm tracking-[0.04em] no-underline",
              )}
            >
              Open status page
            </Link>
          </div>
        </CardContent>
        <CardFooter className="border-0 px-6 pb-6 pt-0 sm:px-10 sm:pb-10" />
      </Card>
    </main>
  );
}
