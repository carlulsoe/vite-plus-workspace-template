import { cleanup } from "@testing-library/react";
import { afterEach } from "vite-plus/test";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => ({}),
});

afterEach(() => {
  cleanup();
});
