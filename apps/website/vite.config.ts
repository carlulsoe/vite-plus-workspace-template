import { defineConfig } from "vite-plus";
import { createWebsiteAppConfig } from "./vite.shared.ts";

export default defineConfig({
  ...createWebsiteAppConfig(),
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
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "**/node_modules/**", "**/.git/**"],
    setupFiles: "./src/test/setup.ts",
    coverage: {
      include: ["src/components/*.tsx", "src/config/**/*.ts", "src/lib/**/*.{ts,tsx}"],
      exclude: [
        "**/coverage/**",
        "**/*.config.{js,ts,mjs,mts,cjs,cts}",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "e2e/**",
        "src/routeTree.gen.ts",
        "src/test/**",
      ],
      thresholds: {
        statements: 100,
        branches: 90,
        functions: 100,
        lines: 100,
      },
    },
  },
});
