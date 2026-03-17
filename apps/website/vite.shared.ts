import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import type { UserConfig } from "vite-plus";

const isVitest = process.env.VITEST === "true";

export function createWebsiteAppConfig({
  useWorkspaceRoot = false,
}: {
  useWorkspaceRoot?: boolean;
} = {}) {
  const plugins = (
    isVitest ? [viteReact()] : [nitro(), tailwindcss(), tanstackStart(), viteReact()]
  ).flat();

  return {
    ...(useWorkspaceRoot
      ? {
          root: fileURLToPath(new URL("./", import.meta.url)),
        }
      : {}),
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@vite-plus-workspace-template/core": fileURLToPath(
          new URL("../../packages/utils/src/index.ts", import.meta.url),
        ),
      },
    },
    plugins,
  } as Pick<UserConfig, "plugins" | "resolve" | "root">;
}
