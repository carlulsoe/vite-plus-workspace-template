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
- rewrites `vite-plus-workspace-template`, `Workspace Starter`, and
  `@vite-plus-workspace-template/core`

Note: the directory goes after `--` because it is handled by the Bingo generator, not by Vite+'s
top-level `vp create --directory` option.

## 2. GitHub Template Repo

Once the repo shape stabilizes, publish it as a GitHub template repository and use:

```bash
vp create github:<owner>/<repo> --directory my-new-app
```

That path is simpler for external consumers, but it does not personalize package names unless the
repo itself already uses generic names.

## Baseline

The template baseline is now a generic workspace planning / delivery starter:

- project slug: `vite-plus-workspace-template`
- human title: `Workspace Starter`
- shared package: `@vite-plus-workspace-template/core`

New template output should inherit that generic baseline and then personalize it through the
generator options.
