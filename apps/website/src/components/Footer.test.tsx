import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import { siteConfig } from "@/config/site";
import Footer from "./Footer";

describe("Footer", () => {
  test("renders the configured footer content", () => {
    const { container } = render(<Footer />);

    expect(screen.getByText(siteConfig.name)).toBeTruthy();
    expect(screen.getByText(siteConfig.description)).toBeTruthy();
    expect(screen.getByText(siteConfig.footerTagline)).toBeTruthy();
    expect(container.querySelector('[data-slot="separator"]')).toBeTruthy();
  });
});
