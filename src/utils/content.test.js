import { describe, expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { extractFrontmatter, processRevealBlocks } from "./frontmatter.js";

const dataRoot = join(import.meta.dir, "../data");
const assetsRoot = join(import.meta.dir, "../assets");
const categories = [
  "characters",
  "pathways",
  "places",
  "gods",
  "organizations",
  "spells",
  "sealed_artifacts",
];

function slugFromName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

async function loadEntries() {
  const entries = [];

  for (const category of categories) {
    const files = (await readdir(join(dataRoot, category)))
      .filter((file) => extname(file) === ".md");

    for (const file of files) {
      const raw = await readFile(join(dataRoot, category, file), "utf8");
      const parsed = extractFrontmatter(raw);
      entries.push({ category, file, raw, ...parsed });
    }
  }

  return entries;
}

describe("wiki content", () => {
  test("has valid metadata and spoiler directives", async () => {
    const entries = await loadEntries();
    const names = new Set();

    for (const entry of entries) {
      expect(entry.data.name).toBeTruthy();
      expect(entry.data.category).toBeTruthy();
      expect(entry.data.introducedInVolume).toBeGreaterThanOrEqual(1);
      expect(entry.data.introducedInVolume).toBeLessThanOrEqual(3);
      expect(names.has(entry.data.name)).toBe(false);
      names.add(entry.data.name);

      const warnings = [];
      processRevealBlocks(entry.content, 3, {
        warn: (message) => warnings.push(message),
      });
      expect(warnings).toEqual([]);
    }
  });

  test("has a local image for every entry", async () => {
    const entries = await loadEntries();

    for (const entry of entries) {
      const imageNames = new Set(
        (await readdir(join(assetsRoot, entry.category)))
          .map((file) => file.replace(/\.[^.]+$/, "")),
      );
      const slug = slugFromName(entry.data.name);
      const hasLegacyKleinImage = (
        slug === "klein_moretti"
        && imageNames.has("klein_morreti")
      );

      expect(imageNames.has(slug) || hasLegacyKleinImage).toBe(true);
    }
  });
});
