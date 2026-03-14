import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";

afterEach(() => {
  cleanup();
});

describe("Field primitives", () => {
  test("renders the composed field structure with responsive layout metadata", () => {
    const { container } = render(
      <FieldSet className="field-set">
        <FieldLegend variant="label">Deployment settings</FieldLegend>
        <FieldGroup className="field-group" data-variant="outline">
          <Field orientation="responsive" className="field-root">
            <FieldLabel className="field-label" htmlFor="field-input">
              <FieldTitle className="field-title">Rollout window</FieldTitle>
            </FieldLabel>
            <FieldContent className="field-content">
              <input id="field-input" />
              <FieldDescription className="field-description">
                Choose when the change can ship.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>,
    );

    const fieldSet = container.querySelector('[data-slot="field-set"]');
    const legend = container.querySelector('[data-slot="field-legend"]');
    const group = container.querySelector('[data-slot="field-group"]');
    const field = container.querySelector('[data-slot="field"]');
    const label = container.querySelector('[data-slot="field-label"]');
    const title = container.querySelector(".field-title");
    const content = container.querySelector('[data-slot="field-content"]');
    const description = container.querySelector('[data-slot="field-description"]');

    expect(fieldSet?.className).toContain("field-set");
    expect(legend?.getAttribute("data-variant")).toBe("label");
    expect(group?.className).toContain("field-group");
    expect(field?.getAttribute("data-slot")).toBe("field");
    expect(field?.getAttribute("data-orientation")).toBe("responsive");
    expect(field?.className).toContain("field-root");
    expect(label?.className).toContain("field-label");
    expect(title?.textContent).toBe("Rollout window");
    expect(content?.className).toContain("field-content");
    expect(description?.textContent).toContain("Choose when the change can ship.");
  });

  test("renders separator content only when children are provided", () => {
    const { container, rerender } = render(<FieldSeparator className="plain-separator" />);

    const emptySeparator = container.querySelector('[data-slot="field-separator"]');

    expect(emptySeparator?.getAttribute("data-content")).toBe("false");
    expect(emptySeparator?.className).toContain("plain-separator");
    expect(container.querySelector('[data-slot="field-separator-content"]')).toBeNull();

    rerender(<FieldSeparator className="labeled-separator">Optional settings</FieldSeparator>);

    const labeledSeparator = container.querySelector('[data-slot="field-separator"]');
    const labeledContent = container.querySelector('[data-slot="field-separator-content"]');

    expect(labeledSeparator?.getAttribute("data-content")).toBe("true");
    expect(labeledContent?.textContent).toBe("Optional settings");
  });

  test("renders no error output when there is no content", () => {
    const { container } = render(<FieldError className="field-error" />);

    expect(container.firstChild).toBeNull();
  });

  test("renders a single deduplicated error message when repeated messages are provided", () => {
    const { container } = render(
      <FieldError
        className="field-error"
        errors={[{ message: "A title is required." }, { message: "A title is required." }]}
      />,
    );

    const error = container.querySelector('[data-slot="field-error"]');

    expect(error?.className).toContain("field-error");
    expect(error?.textContent).toBe("A title is required.");
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });

  test("renders a unique list when multiple different errors are present", () => {
    const { container } = render(
      <FieldError
        errors={[
          { message: "Name is required." },
          { message: "Name is required." },
          { message: "Name must be at least 3 characters." },
          undefined,
        ]}
      />,
    );

    const error = container.querySelector('[data-slot="field-error"]');
    const items = Array.from(error?.querySelectorAll("li") ?? []).map((item) => item.textContent);

    expect(error).toBeTruthy();
    expect(items).toEqual(["Name is required.", "Name must be at least 3 characters."]);
  });

  test("prefers explicit children over derived errors", () => {
    const { container } = render(
      <FieldError errors={[{ message: "Derived error" }]}>
        <span>Explicit content</span>
      </FieldError>,
    );

    const error = container.querySelector('[data-slot="field-error"]');

    expect(error?.textContent).toContain("Explicit content");
    expect(error?.textContent).not.toContain("Derived error");
  });
});
