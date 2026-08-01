import { describe, expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { extractFrontmatter, processRevealBlocks } from "./frontmatter.js";
import { slugFromName } from "./textUtils.js";
import { CATEGORY_KEYS } from "../config/categories.js";
import { LAST_VOLUME } from "../config/volumes.js";

const dataRoot = join(import.meta.dir, "../data");
const assetsRoot = join(import.meta.dir, "../assets");
// Driven by the registry so a new category is validated the moment it is added.
const categories = CATEGORY_KEYS;

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
      expect(entry.data.introducedInVolume).toBeLessThanOrEqual(LAST_VOLUME);
      expect(names.has(entry.data.name)).toBe(false);
      names.add(entry.data.name);

      const warnings = [];
      processRevealBlocks(entry.content, LAST_VOLUME, {
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

      expect(imageNames.has(slug)).toBe(true);
    }
  });

  test("registers every content folder in the category registry", async () => {
    // The loaders discover folders by glob, so a folder missing from the
    // registry would ship content with no route and no nav entry.
    const folders = (await readdir(dataRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const folder of folders) {
      const hasMarkdown = (await readdir(join(dataRoot, folder)))
        .some((file) => extname(file) === ".md");

      if (hasMarkdown) {
        expect(CATEGORY_KEYS).toContain(folder);
      }
    }
  });
});
