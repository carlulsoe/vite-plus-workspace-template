import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import { siteConfig } from "@/config/site";
import Footer from "./Footer";

describe("Footer", () => {
  test("renders the configured footer content", () => {
    const { container } = render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    const tagline = screen.getByText(siteConfig.footerTagline);
    const separator = container.querySelector('[data-slot="separator"]');

    expect(footer.className).toContain("reveal-up");
    expect(footer.className).toContain("pb-12");
    expect(footer.className).toContain("pt-8");
    expect(footer.textContent).toContain(siteConfig.name);
    expect(footer.textContent).toContain(siteConfig.description);
    expect(footer.contains(screen.getByText(siteConfig.name))).toBe(true);
    expect(footer.contains(screen.getByText(siteConfig.description))).toBe(true);
    expect(footer.contains(tagline)).toBe(true);
    expect(tagline.className).toContain("badge-section");
    expect(tagline.getAttribute("data-slot")).toBe("badge");
    expect(tagline.getAttribute("data-variant")).toBe("outline");
    expect(separator).toBeTruthy();
    expect(footer.contains(separator as Node)).toBe(true);
    expect(separator?.className).toContain("bg-black/5");
  });
});
