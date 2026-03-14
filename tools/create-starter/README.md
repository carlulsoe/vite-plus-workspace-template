# Starter Generator

This package turns the current monorepo into a local Vite+ template.

## Usage

From the monorepo root:

```bash
vp create create-starter -- --directory my-new-app --name my-new-app
```

The generator copies the current repo scaffold, removes generated/template-only files, and
replaces the default project identity (`heaven-financial`, `Heaven Financial`,
`@heaven-financial/market`) with values derived from `--name`. The target directory is passed after
`--` because it is defined by Bingo, not by Vite+'s builtin template flags.

## Development

```bash
vp run create-starter#dev
```

Edit [src/template.ts](/var/home/carlulsoechristensen/Documents/heaven-financial/tools/create-starter/src/template.ts)
to change what gets copied or personalized.
