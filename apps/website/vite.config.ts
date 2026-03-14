import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

const isVitest = process.env.VITEST === "true";

export default defineConfig({
  run: {
    tasks: {
      test: {
        command: "vp test",
        input: [
          { auto: true },
          "!.output/**",
          "!node_modules/.vite/**",
          "!playwright-report/**",
          "!test-results/**",
        ],
      },
      build: {
        command: "./node_modules/.bin/tsgo && vp build",
        input: [
          { auto: true },
          "!.output/**",
          "!node_modules/.vite/**",
          "!playwright-report/**",
          "!test-results/**",
        ],
      },
      e2e: {
        command: "./node_modules/.bin/playwright test",
        dependsOn: ["build"],
        input: [
          { auto: true },
          "!.output/**",
          "!node_modules/.vite/**",
          "!playwright-report/**",
          "!test-results/**",
        ],
      },
    },
  },
  fmt: {
    ignorePatterns: ["src/routeTree.gen.ts"],
  },
  lint: {
    ignorePatterns: ["src/routeTree.gen.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@vite-plus-workspace-template/core": fileURLToPath(
        new URL("../../packages/utils/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "**/node_modules/**", "**/.git/**"],
    setupFiles: "./src/test/setup.ts",
  },
  plugins: isVitest ? [viteReact()] : [nitro(), tailwindcss(), tanstackStart(), viteReact()],
});
