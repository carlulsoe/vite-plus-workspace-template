export const siteConfig = {
  name: "Workspace Starter",
  description: "A generic Vite+ starter built on TanStack Start, Nitro, and a shared core package.",
  footerTagline: "Package-first planning logic with Nitro-backed routes",
  badges: [
    "TanStack Start",
    "Nitro",
    "Shared Core",
    "Budget Scenarios",
    "Health Checks",
    "Workspace Package",
  ],
  operatingPrinciples: [
    "Keep shared planning logic in workspace packages and keep routes thin.",
    "Expose operational health early with status pages and machine-readable endpoints.",
    "Favor reusable planning services over one-off UI calculations.",
  ],
  stackNotes: [
    {
      title: "Shared Core Package",
      copy: "The dashboard reads its signals and planning scenarios from a workspace package instead of local component glue.",
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
