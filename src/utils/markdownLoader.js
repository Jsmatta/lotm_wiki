// Discovers and parses every wiki markdown file.
//
// One wildcard glob covers all categories, so a new `src/data/<category>/`
// folder is picked up with no change here. Files stay lazily imported (the
// corpus is a few hundred kB), and `vite.config.js` bundles each category
// folder into a single chunk so opening a category costs one request rather
// than one per entry.

import { extractFrontmatter } from "./frontmatter.js";

const rawModules = import.meta.glob("../data/*/*.md", {
  query: "?raw",
  import: "default",
});

const ENTRY_PATH = /\/data\/([^/]+)\/([^/]+)\.md$/;

/** category -> Map<id, () => Promise<string>>, in stable glob (alphabetical) order. */
const loadersByCategory = new Map();

for (const [path, load] of Object.entries(rawModules)) {
  const match = path.match(ENTRY_PATH);
  if (!match) continue;

  const [, category, id] = match;
  let loaders = loadersByCategory.get(category);

  if (!loaders) {
    loaders = new Map();
    loadersByCategory.set(category, loaders);
  }

  loaders.set(id, load);
}

/** Category folders that actually exist under `src/data/`. */
export const DISCOVERED_CATEGORIES = [...loadersByCategory.keys()];

/**
 * Parsed entries, cached per category for the lifetime of the page. Parsing is
 * volume-independent: only `body` is filtered later, so switching volumes never
 * re-reads or re-parses frontmatter.
 */
const entriesByCategory = new Map();
const entryIndexByCategory = new Map();

function parseEntry(category, id, raw) {
  const { data, content } = extractFrontmatter(raw);
  const introducedInVolume = Number(data.introducedInVolume);

  if (!Number.isFinite(introducedInVolume)) {
    console.warn(
      `"${data.name || id}" (${category}/${id}) is missing a valid introducedInVolume; hiding it until fixed.`,
    );
  }

  return {
    id,
    category,
    name: data.name,
    // Frontmatter `category` is the display label ("character"); the folder
    // name is the routing key ("characters").
    label: data.category || category,
    introducedInVolume,
    body: content,
  };
}

async function loadCategory(category) {
  const loaders = loadersByCategory.get(category);

  return Promise.all(
    [...loaders].map(async ([id, load]) => parseEntry(category, id, await load())),
  );
}

/** @returns {Promise<Array<{id, category, name, label, introducedInVolume, body}>>} */
export function getCategoryEntries(category) {
  if (!loadersByCategory.has(category)) return Promise.resolve([]);

  let pending = entriesByCategory.get(category);

  if (!pending) {
    pending = loadCategory(category).catch((error) => {
      entriesByCategory.delete(category);
      throw error;
    });
    entriesByCategory.set(category, pending);
  }

  return pending;
}

/** Look up one entry by its filename key without scanning the category. */
export async function getCategoryEntry(category, id) {
  const entries = await getCategoryEntries(category);
  let index = entryIndexByCategory.get(category);

  if (!index) {
    index = new Map(entries.map((entry) => [entry.id, entry]));
    entryIndexByCategory.set(category, index);
  }

  return index.get(id) ?? null;
}

/** Warm every category during browser idle time. */
export function preloadAllCategories() {
  return Promise.all(DISCOVERED_CATEGORIES.map(getCategoryEntries));
}
