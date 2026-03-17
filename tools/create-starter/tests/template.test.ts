import { describe, expect, test } from "vite-plus/test";

import template from "../src/template.ts";

type GeneratedDirectory = Record<string, unknown>;

function expectStringFile(value: unknown) {
  expect(typeof value === "string" || Array.isArray(value)).toBe(true);

  if (Array.isArray(value)) {
    expect(typeof value[0]).toBe("string");
    return value[0];
  }

  return value;
}

function expectBinaryFile(value: unknown) {
  const fileEntry = value as [Uint8Array];

  expect(Array.isArray(value)).toBe(true);
  expect(ArrayBuffer.isView(fileEntry[0])).toBe(true);

  return fileEntry[0];
}

function expectDirectory(value: unknown) {
  expect(value).toBeTruthy();
  expect(typeof value).toBe("object");
  expect(Array.isArray(value)).toBe(false);

  return value as GeneratedDirectory;
}

describe("create-starter template", () => {
  test("produces a rewritten workspace scaffold", async () => {
    const creation = await template.produce({
      options: {
        name: "acme-workspace",
      },
    });

    expect(creation.suggestions).toEqual(["vp install", "vp check", "vp run dev"]);

    const files = creation.files;
    expect(files).toBeDefined();
    expect(typeof files).toBe("object");

    const readme = expectStringFile(files?.["README.md"]);
    expect(readme).toContain("# Acme Workspace");
    expect(readme).toContain("@acme-workspace/core");
    expect(readme).not.toContain("Workspace Starter");
    expect(readme).not.toContain("@vite-plus-workspace-template/core");

    expect(files?.["tools"]).toBeUndefined();
    expect(files?.[".git"]).toBeUndefined();
    expect(files?.["node_modules"]).toBeUndefined();

    const docsDirectory = expectDirectory(files?.["docs"]);
    expect(docsDirectory["template.md"]).toBeUndefined();

    const packageJson =
      files?.["package.json"] && typeof files["package.json"] !== "object"
        ? expectStringFile(files["package.json"])
        : undefined;
    expect(packageJson).toContain('"name": "acme-workspace"');
    expect(packageJson).not.toContain("vite-plus-workspace-template");

    const appsDirectory = expectDirectory(files?.["apps"]);
    const websiteDirectory = expectDirectory(appsDirectory["website"]);
    const appPackageJson = expectStringFile(websiteDirectory["package.json"]);
    expect(appPackageJson).toContain('"name": "website"');
    expect(appPackageJson).toContain('"@acme-workspace/core": "workspace:*"');
    const srcDirectory = expectDirectory(websiteDirectory["src"]);
    const assetsDirectory = expectDirectory(srcDirectory["assets"]);
    expect(expectBinaryFile(assetsDirectory["hero.png"]).byteLength).toBeGreaterThan(0);
    expect(expectStringFile(assetsDirectory["typescript.svg"])).toContain("<svg");

    const e2eDirectory = expectDirectory(websiteDirectory["e2e"]);
    const snapshotsDirectory = expectDirectory(e2eDirectory["dashboard.spec.ts-snapshots"]);
    expect(
      expectBinaryFile(snapshotsDirectory["dashboard-page-chromium-linux.png"]).byteLength,
    ).toBeGreaterThan(0);

    const packagesDirectory = expectDirectory(files?.["packages"]);
    const utilsDirectory = expectDirectory(packagesDirectory["utils"]);
    const utilsPackageJson = expectStringFile(utilsDirectory["package.json"]);
    expect(utilsPackageJson).toContain('"name": "@acme-workspace/core"');
    expect(utilsPackageJson).toContain('"author": "Acme Workspace"');
  });

  test("uses an explicit title when provided", async () => {
    const creation = await template.produce({
      options: {
        name: "acme-workspace",
        title: "Launchpad",
      },
    });

    const readme =
      creation.files?.["README.md"] && typeof creation.files["README.md"] !== "object"
        ? expectStringFile(creation.files["README.md"])
        : undefined;

    expect(readme).toContain("# Launchpad");
    expect(readme).not.toContain("# Acme Workspace");
  });
});
