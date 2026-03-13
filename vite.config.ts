import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["apps/website/src/routeTree.gen.ts"],
  },
  lint: {
    ignorePatterns: ["apps/website/src/routeTree.gen.ts"],
    options: { typeAware: true, typeCheck: true },
  },
});
