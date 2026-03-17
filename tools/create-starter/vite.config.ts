import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        "**/coverage/**",
        "**/*.config.{js,ts,mjs,mts,cjs,cts}",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/dist/**",
      ],
      thresholds: {
        statements: 81,
        branches: 86,
        functions: 100,
        lines: 81,
      },
    },
  },
});
