// @vitest-environment node

import { afterEach, describe, expect, test } from "vite-plus/test";
import { createRootConfig } from "./vite.config.ts";

const originalArgv = [...process.argv];

afterEach(() => {
  process.argv.splice(0, process.argv.length, ...originalArgv);
});

describe("root Vite+ config", () => {
  test("uses the website app config for root build commands", () => {
    const config = createRootConfig("build");

    expect(config.root).toContain("/apps/website/");
    expect(config.plugins?.length).toBeGreaterThan(0);
    expect(config.resolve?.alias).toMatchObject({
      "@vite-plus-workspace-template/core": expect.stringContaining("/packages/utils/src/index.ts"),
    });
  });

  test("keeps the workspace-only config for test commands", () => {
    const config = createRootConfig("test");

    expect(config.root).toBeUndefined();
    expect(config.run?.tasks?.ready).toBeTruthy();
    expect(config.resolve?.alias).toMatchObject({
      "@": expect.stringContaining("/apps/website/src"),
    });
  });
});
