# Starter Generator

This package turns the current monorepo into a local Vite+ template.

## Usage

From the monorepo root:

```bash
vp create create-starter -- --directory my-new-app --name my-new-app
```

The generator copies the current repo scaffold, removes generated/template-only files and output
directories, regenerates the root `README.md`, and replaces the default project identity
(`vite-plus-workspace-template`, `Workspace Starter`, `@vite-plus-workspace-template/core`) with
values derived from `--name`. The target directory is passed after `--` because it is defined by
Bingo, not by Vite+'s builtin template flags.

Current exclusions include:

- `.git`, `node_modules`, `.tanstack`, `.vite-hooks`
- `tools/create-starter`
- `apps/website/src/routeTree.gen.ts`
- `docs/template.md`
- generated output folders such as `.output`, `coverage`, `dist`, `playwright-report`, and
  `test-results`

After generation, the template suggests:

```bash
vp install
vp check
vp run dev
```

## Development

```bash
vp run create-starter#dev
```

Edit `src/template.ts` to change what gets copied or personalized.
