import { constants } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createTemplate } from "bingo";
import { z } from "zod";

import pkgJson from "../package.json" with { type: "json" };

type TemplateFileMetadata = {
  executable?: boolean;
};

interface TemplateDirectory {
  [name: string]: TemplateDirectory | string | [string, TemplateFileMetadata];
}

function resolveRepoRoot() {
  try {
    return fileURLToPath(new URL("../../../", import.meta.url));
  } catch {
    // Vitest's module runner doesn't expose a standard file URL here.
    return resolve(process.cwd(), "../..");
  }
}

const excludedPaths = [
  ".git",
  ".tanstack",
  ".vite-hooks",
  "node_modules",
  "tools/create-starter",
  "apps/website/src/routeTree.gen.ts",
  "docs/template.md",
] as const;

const excludedDirectoryNames = new Set(["coverage", "dist", "playwright-report", "test-results"]);

const excludedFileNames = new Set([".DS_Store"]);

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsonc",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const textFileNames = new Set([
  ".editorconfig",
  ".env",
  ".env.example",
  ".gitattributes",
  ".gitignore",
  ".npmrc",
  ".nvmrc",
  "Dockerfile",
]);

function shouldExclude(relativePath: string, name: string) {
  if (excludedFileNames.has(name) || excludedDirectoryNames.has(name)) {
    return true;
  }

  return excludedPaths.some(
    (excludedPath) => relativePath === excludedPath || relativePath.startsWith(`${excludedPath}/`),
  );
}

function isTextFile(name: string) {
  return textFileNames.has(name) || textExtensions.has(extname(name));
}

function toTitleCase(name: string) {
  return name
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function replaceTemplateTokens(contents: string, projectSlug: string, projectTitle: string) {
  return [
    ["@vite-plus-workspace-template/core", `@${projectSlug}/core`],
    ["Workspace Starter", projectTitle],
    ["vite-plus-workspace-template", projectSlug],
  ].reduce(
    (currentContents, [searchValue, replaceValue]) =>
      currentContents.replaceAll(searchValue, replaceValue),
    contents,
  );
}

function createGeneratedReadme(projectTitle: string, projectSlug: string) {
  return `# ${projectTitle}

A Vite+ monorepo starter for workspace planning and delivery flows, built with TanStack Start,
Nitro-backed routes, and a shared domain package.

## Development

\`\`\`bash
vp install
vp run dev
vp run ready
\`\`\`

## Dev Container

Open the repo in a Dev Container to get Node 22, the global \`vp\` CLI, and Chromium browser
support for Playwright. The container runs \`CI=true vp install\` on first create, so workspace
dependencies are installed without needing an interactive TTY.

## Layout

- The website lives in \`apps/website\`.
- Shared domain logic lives in \`packages/utils\`, exported as \`@${projectSlug}/core\`.
- The architectural layering note is in \`docs/architecture/layering.md\`.
`;
}

async function readTemplateDirectory(
  absoluteDirectoryPath: string,
  relativeDirectoryPath = "",
  projectSlug: string,
  projectTitle: string,
): Promise<TemplateDirectory> {
  const entries = await readdir(absoluteDirectoryPath, { withFileTypes: true });
  const output: TemplateDirectory = {};

  for (const entry of entries) {
    const entryRelativePath = relativeDirectoryPath
      ? `${relativeDirectoryPath}/${entry.name}`
      : entry.name;

    if (shouldExclude(entryRelativePath, entry.name)) {
      continue;
    }

    const entryAbsolutePath = join(absoluteDirectoryPath, entry.name);

    if (entry.isDirectory()) {
      const nestedDirectory = await readTemplateDirectory(
        entryAbsolutePath,
        entryRelativePath,
        projectSlug,
        projectTitle,
      );

      if (Object.keys(nestedDirectory).length > 0) {
        output[entry.name] = nestedDirectory;
      }

      continue;
    }

    if (!isTextFile(entry.name)) {
      continue;
    }

    const [contents, fileStats] = await Promise.all([
      readFile(entryAbsolutePath, "utf8"),
      stat(entryAbsolutePath),
    ]);

    const replacedContents = replaceTemplateTokens(contents, projectSlug, projectTitle);
    const executable = Boolean(fileStats.mode & constants.S_IXUSR);

    output[entry.name] = executable ? [replacedContents, { executable: true }] : replacedContents;
  }

  return output;
}

export default createTemplate({
  about: {
    name: pkgJson.name,
    description: pkgJson.description,
  },
  options: {
    name: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case, for example my-new-app.")
      .describe("Project name"),
    title: z.string().optional().describe("Project title"),
  },
  async produce({ options }) {
    const projectSlug = options.name;
    const projectTitle = options.title ?? toTitleCase(projectSlug);
    const files = await readTemplateDirectory(resolveRepoRoot(), "", projectSlug, projectTitle);
    files["README.md"] = createGeneratedReadme(projectTitle, projectSlug);

    return {
      files,
      suggestions: ["vp install", "vp check", "vp run dev"],
    };
  },
});
