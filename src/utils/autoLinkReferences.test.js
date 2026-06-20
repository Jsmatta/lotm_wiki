import { describe, expect, test } from "bun:test";
import { remarkAutoLinkReferences } from "./autoLinkReferences.js";

const references = [
  { name: "Evernight Goddess", to: "/gods/evernight_goddess" },
  { name: "Church of the Evernight Goddess", to: "/organizations/church_of_evernight" },
];

function transform(tree) {
  remarkAutoLinkReferences(references)()(tree);
  return tree;
}

describe("remarkAutoLinkReferences", () => {
  test("links wiki names to their internal routes", () => {
    const tree = transform({
      type: "root",
      children: [{
        type: "paragraph",
        children: [{
          type: "text",
          value: "The Evernight Goddess watches over Tingen.",
        }],
      }],
    });

    expect(tree.children[0].children).toEqual([
      { type: "text", value: "The " },
      {
        type: "link",
        url: "/gods/evernight_goddess",
        children: [{ type: "text", value: "Evernight Goddess" }],
      },
      { type: "text", value: " watches over Tingen." },
    ]);
  });

  test("prefers the longest matching page name", () => {
    const tree = transform({
      type: "root",
      children: [{
        type: "paragraph",
        children: [{
          type: "text",
          value: "The Church of the Evernight Goddess has many members.",
        }],
      }],
    });

    expect(tree.children[0].children[1].url).toBe(
      "/organizations/church_of_evernight",
    );
  });

  test("does not alter existing links or code", () => {
    const existingLink = {
      type: "link",
      url: "https://example.com",
      children: [{ type: "text", value: "Evernight Goddess" }],
    };
    const inlineCode = { type: "inlineCode", value: "Evernight Goddess" };
    const tree = transform({
      type: "root",
      children: [{
        type: "paragraph",
        children: [existingLink, inlineCode],
      }],
    });

    expect(tree.children[0].children).toEqual([existingLink, inlineCode]);
  });
});

