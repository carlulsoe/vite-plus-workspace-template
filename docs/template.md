# Template Strategy

This repo can now be used as a real Vite+ template in two ways.

## 1. Local Generator

Use the generator when you want the scaffold to personalize the new project identity:

```bash
vp create create-starter -- --directory my-new-app --name my-new-app
```

What it currently does:

- copies the current monorepo scaffold
- excludes generated/template-only paths such as `.git`, `node_modules`, `.tanstack`,
  `.vite-hooks`, `tools/create-starter`, and `apps/website/src/routeTree.gen.ts`
- rewrites `heaven-financial`, `Heaven Financial`, and `@heaven-financial/market`

Note: the directory goes after `--` because it is handled by the Bingo generator, not by Vite+'s
top-level `vp create --directory` option.

## 2. GitHub Template Repo

Once the repo shape stabilizes, publish it as a GitHub template repository and use:

```bash
vp create github:<owner>/<repo> --directory my-new-app
```

That path is simpler for external consumers, but it does not personalize package names unless the
repo itself already uses generic names.

## Next Cleanup If You Want A More Neutral Starter

The current starter still carries the market/finance demo content. If the goal is a broadly useful
template for new projects, the next pass should replace:

- `@heaven-financial/market` with a more neutral shared package name
- market-specific copy in `apps/website`
- finance-specific test assertions and documentation
