import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  test("renders the full card composition with default sizing", () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="card-header">
          <CardTitle>Coverage summary</CardTitle>
          <CardDescription>Source-only scope</CardDescription>
          <CardAction>Review</CardAction>
        </CardHeader>
        <CardContent>Statement and branch metrics</CardContent>
        <CardFooter>Updated just now</CardFooter>
      </Card>,
    );

    const card = screen.getByTestId("card");
    const header = screen.getByTestId("card-header");

    expect(card.getAttribute("data-slot")).toBe("card");
    expect(card.getAttribute("data-size")).toBe("default");
    expect(card.className).toContain("group/card");
    expect(card.className).toContain("ring-1");
    expect(screen.getByText("Coverage summary").getAttribute("data-slot")).toBe("card-title");
    expect(screen.getByText("Coverage summary").className).toContain("font-medium");
    expect(screen.getByText("Source-only scope").getAttribute("data-slot")).toBe(
      "card-description",
    );
    expect(screen.getByText("Source-only scope").className).toContain("text-muted-foreground");
    expect(screen.getByText("Review").getAttribute("data-slot")).toBe("card-action");
    expect(screen.getByText("Review").className).toContain("justify-self-end");
    expect(screen.getByText("Statement and branch metrics").getAttribute("data-slot")).toBe(
      "card-content",
    );
    expect(screen.getByText("Statement and branch metrics").className).toContain("px-4");
    expect(screen.getByText("Updated just now").getAttribute("data-slot")).toBe("card-footer");
    expect(screen.getByText("Updated just now").className).toContain("border-t");
    expect(header.className).toContain("group/card-header");
  });

  test("applies small sizing and forwards custom class names", () => {
    render(
      <Card className="custom-card" size="sm">
        <CardHeader className="custom-header">Header</CardHeader>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>,
    );

    const card = screen.getByText("Header").closest("[data-slot='card']");

    expect(card).toBeTruthy();
    expect(card?.getAttribute("data-size")).toBe("sm");
    expect(card?.className).toContain("custom-card");
    expect(screen.getByText("Header").className).toContain("custom-header");
    expect(screen.getByText("Content").className).toContain("custom-content");
    expect(screen.getByText("Footer").className).toContain("custom-footer");
  });
});
