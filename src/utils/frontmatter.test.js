import { describe, expect, test } from "bun:test";
import {
  extractFrontmatter,
  filterByVolume,
  processRevealBlocks,
} from "./frontmatter.js";

const silentOptions = { warn: () => {} };

describe("processRevealBlocks", () => {
  test("reveals content at the selected volume", () => {
    const markdown = [
      "Safe introduction.",
      ":::reveal at=2",
      "Volume two secret.",
      ":::",
    ].join("\n");

    expect(processRevealBlocks(markdown, 1, silentOptions)).toBe(
      "Safe introduction.",
    );
    expect(processRevealBlocks(markdown, 2, silentOptions)).toBe(
      "Safe introduction.\nVolume two secret.",
    );
  });

  test("supports aliases, flexible spacing, quotes, and Windows line endings", () => {
    const markdown = [
      "Before",
      "  :::spoiler volume = \"3\"",
      "Secret",
      "  :::",
      "After",
    ].join("\r\n");

    expect(processRevealBlocks(markdown, 3, silentOptions)).toBe(
      "Before\nSecret\nAfter",
    );
  });

  test("supports nested spoiler blocks", () => {
    const markdown = [
      ":::reveal at=1",
      "Visible at one.",
      ":::reveal at=2",
      "Visible at two.",
      ":::",
      "Visible at one again.",
      ":::",
    ].join("\n");

    expect(processRevealBlocks(markdown, 1, silentOptions)).toBe(
      "Visible at one.\nVisible at one again.",
    );
    expect(processRevealBlocks(markdown, 2, silentOptions)).toBe(
      "Visible at one.\nVisible at two.\nVisible at one again.",
    );
  });

  test("does not interpret directives inside fenced code", () => {
    const markdown = [
      "```markdown",
      ":::reveal at=8",
      "Example content",
      ":::",
      "```",
    ].join("\n");

    expect(processRevealBlocks(markdown, 0, silentOptions)).toBe(markdown);
  });

  test("fails closed for invalid and unclosed spoiler blocks", () => {
    const invalid = [
      "Safe",
      ":::reveal later",
      "Secret",
      ":::",
      "Safe again",
    ].join("\n");
    const unclosed = [
      "Safe",
      ":::reveal at=0",
      "Secret",
    ].join("\n");

    expect(processRevealBlocks(invalid, 8, silentOptions)).toBe(
      "Safe\nSafe again",
    );
    expect(processRevealBlocks(unclosed, 8, silentOptions)).toBe("Safe");
  });
});

describe("frontmatter utilities", () => {
  test("accepts a BOM and Windows line endings", () => {
    const markdown = "\uFEFF---\r\nname: Test\r\nintroducedInVolume: 2\r\n---\r\nBody";
    const parsed = extractFrontmatter(markdown);

    expect(parsed.data).toEqual({
      name: "Test",
      introducedInVolume: 2,
    });
    expect(parsed.content).toBe("Body");
  });

  test("filters invalid volume metadata instead of exposing it", () => {
    const items = [
      { introducedInVolume: 0 },
      { introducedInVolume: "2" },
      { introducedInVolume: "unknown" },
    ];

    expect(filterByVolume(items, 2)).toEqual(items.slice(0, 2));
  });
});
