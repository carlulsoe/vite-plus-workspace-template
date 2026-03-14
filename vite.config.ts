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
    tasks: {
      ready: {
        command: "echo 'Everything is ready!'",
        cache: false,
        dependsOn: ["ready:e2e"],
      },
      "ready:fmt": {
        command: "vp fmt",
        input: [
          { auto: true },
          "!apps/website/.output/**",
          "!apps/website/playwright-report/**",
          "!apps/website/test-results/**",
        ],
      },
      "ready:lint": {
        command: "vp lint",
        dependsOn: ["ready:fmt"],
        input: [
          { auto: true },
          "!apps/website/.output/**",
          "!apps/website/playwright-report/**",
          "!apps/website/test-results/**",
        ],
      },
      "ready:core-test": {
        command: "vp test",
        cwd: "packages/utils",
        dependsOn: ["ready:lint"],
      },
      "ready:website-test": {
        command: "vp test",
        cwd: "apps/website",
        dependsOn: ["ready:lint"],
        input: [{ auto: true }, "!.output/**", "!playwright-report/**", "!test-results/**"],
      },
      "ready:starter-test": {
        command: "vp test",
        cwd: "tools/create-starter",
        dependsOn: ["ready:lint"],
      },
      "ready:core-build": {
        command: "vp pack",
        cwd: "packages/utils",
        dependsOn: ["ready:core-test", "ready:starter-test", "ready:website-test"],
      },
      "ready:website-build": {
        command: "./node_modules/.bin/tsgo && vp build",
        cwd: "apps/website",
        dependsOn: ["ready:core-test", "ready:starter-test", "ready:website-test"],
        input: [{ auto: true }, "!.output/**", "!playwright-report/**", "!test-results/**"],
      },
      "ready:e2e": {
        command: "./node_modules/.bin/playwright test",
        cwd: "apps/website",
        dependsOn: ["ready:core-build", "ready:website-build"],
        input: [{ auto: true }, "!.output/**", "!playwright-report/**", "!test-results/**"],
      },
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
