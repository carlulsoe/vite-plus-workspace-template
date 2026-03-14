import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./apps/website/src", import.meta.url)),
    },
  },
  run: {
    cache: {
      scripts: true,
    },
  },
  test: {
    environment: "jsdom",
    exclude: ["apps/website/e2e/**", "**/node_modules/**", "**/.git/**"],
  },
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
