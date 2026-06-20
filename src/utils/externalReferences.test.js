import { describe, expect, test } from "bun:test";
import { getExternalReferences } from "./externalReferences.js";

describe("getExternalReferences", () => {
  test("uses canonical wiki aliases for renamed pathways", () => {
    expect(
      getExternalReferences("Seer Pathway")[0].href.endsWith("/Fool_Pathway"),
    ).toBe(true);
    expect(
      getExternalReferences("Hunter Pathway")[0].href.endsWith(
        "/Red_Priest_Pathway",
      ),
    ).toBe(true);
    expect(
      getExternalReferences("Mystery Pryer Pathway")[0].href.endsWith(
        "/Hermit_Pathway",
      ),
    ).toBe(true);
  });

  test("creates safe default wiki and Webnovel links", () => {
    const references = getExternalReferences("Groselle's Travels");

    expect(references[0].href).toContain(
      "lordofthemysteries.fandom.com/wiki/Groselle's_Travels",
    );
    expect(references[1].href).toBe(
      "https://www.webnovel.com/book/11022733006234505",
    );
  });
});
