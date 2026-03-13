export const siteConfig = {
  name: "Heaven Financial",
  description:
    "An editorial market briefing built on TanStack Start, Nitro, and a shared domain package.",
  footerTagline: "Package-first market logic with Nitro-backed routes",
  badges: ["TanStack Start", "Nitro", "Rates", "FX", "Credit", "Commodities"],
  operatingPrinciples: [
    "Keep market logic in workspace packages and keep routes thin.",
    "Expose operational health early with status pages and machine-readable endpoints.",
    "Favor reusable allocation services over one-off UI calculations.",
  ],
  stackNotes: [
    {
      title: "Shared Market Package",
      copy: "The dashboard reads its market snapshot and allocation plans from a workspace package instead of local component glue.",
    },
    {
      title: "Nitro Handlers",
      copy: "The app exposes a real /api/health endpoint through TanStack Start file routes backed by Nitro.",
    },
    {
      title: "Reference-Driven Shape",
      copy: "The app shell borrows the Start plus Nitro structure from nitro-and-ts-testing and the package boundary discipline from harness-eng.",
    },
  ],
} as const;
