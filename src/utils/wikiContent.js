// Turns parsed markdown entries into render-ready items for the current volume.

import { getCategoryEntries, getCategoryEntry } from "./markdownLoader.js";
import { getImage } from "./imageLoader.js";
import { filterByVolume, isWithinVolume, processRevealBlocks } from "./frontmatter.js";
import { slugFromName, stripMarkdown } from "./textUtils.js";
import { CATEGORY_KEYS, getCategory } from "../config/categories.js";

// Spoiler-stripping the largest category is a few ms of blocking work; yielding
// between chunks keeps volume switches from janking the frame.
const PARSE_CHUNK_SIZE = 24;

const itemsCache = new Map();

function yieldToMain() {
  return new Promise((resolve) => {
    if (typeof scheduler !== "undefined" && typeof scheduler.yield === "function") {
      scheduler.yield().then(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });
}

function buildItem(entry, selectedVolume) {
  const category = getCategory(entry.category);
  const routeBase = category?.route ?? `/${entry.category}`;
  const name = entry.name || "Untitled";
  const content = processRevealBlocks(entry.body, selectedVolume);

  const item = {
    id: entry.id,
    name,
    /** Folder/registry key, e.g. "sealed_artifacts". */
    category: entry.category,
    /** Frontmatter label shown on badges, e.g. "sealed artifact". */
    label: entry.label,
    /** Route for this item — the route segment is not always the folder name. */
    href: `${routeBase}/${entry.id}`,
    introducedInVolume: entry.introducedInVolume,
    content,
    image: getImage(entry.category, slugFromName(name)),
  };

  // Only card previews and search need the prose forms, and stripping markdown
  // is the most expensive step per item. Derive them on first read and memoize,
  // so detail pages never pay for them and search filtering does the work once.
  let plainText;
  let searchText;

  Object.defineProperties(item, {
    plainText: {
      enumerable: false,
      get: () => (plainText ??= stripMarkdown(content)),
    },
    searchText: {
      enumerable: false,
      get: () => (searchText ??= `${name} ${item.label} ${item.plainText}`.toLowerCase()),
    },
  });

  return item;
}

async function buildItems(entries, selectedVolume) {
  // Filter before processing: entries beyond the reader's volume are dropped
  // without ever running the spoiler parser over their body.
  const visible = filterByVolume(entries, selectedVolume);
  const items = [];

  for (let index = 0; index < visible.length; index += PARSE_CHUNK_SIZE) {
    for (const entry of visible.slice(index, index + PARSE_CHUNK_SIZE)) {
      items.push(buildItem(entry, selectedVolume));
    }

    if (index + PARSE_CHUNK_SIZE < visible.length) {
      await yieldToMain();
    }
  }

  return items;
}

/** Memoize a pending result, dropping the entry if it rejects so retries work. */
function cached(key, factory) {
  let pending = itemsCache.get(key);

  if (!pending) {
    pending = factory().catch((error) => {
      itemsCache.delete(key);
      throw error;
    });
    itemsCache.set(key, pending);
  }

  return pending;
}

export function getCategoryItems(category, selectedVolume) {
  return cached(`${category}:${selectedVolume}`, async () =>
    buildItems(await getCategoryEntries(category), selectedVolume));
}

export async function getCategoryItem(category, id, selectedVolume) {
  const entry = await getCategoryEntry(category, id);

  return entry && isWithinVolume(entry, selectedVolume)
    ? buildItem(entry, selectedVolume)
    : null;
}

/** Flat index across every category, reusing the per-category caches. */
export function getAllItems(selectedVolume) {
  return cached(`*:${selectedVolume}`, async () => {
    const perCategory = await Promise.all(
      CATEGORY_KEYS.map((category) => getCategoryItems(category, selectedVolume)),
    );

    return perCategory.flat();
  });
}
