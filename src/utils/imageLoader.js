// Resolves content images by slugified item name.
//
// The glob is eager on purpose: each entry resolves to nothing more than a
// hashed URL string, so inlining them costs a few kB in the main bundle and
// removes one network round-trip per image just to discover its URL. The
// images themselves are still fetched only when an <img> enters the viewport.

const imageModules = import.meta.glob(
  "../assets/*/*.{webp,jpg,jpeg,png,svg,avif,gif}",
  { eager: true, import: "default" },
);

const ASSET_PATH = /\/assets\/([^/]+)\/([^/]+)\.[^.]+$/;

/** category -> Map<slug, url> */
const imagesByCategory = new Map();

for (const [path, url] of Object.entries(imageModules)) {
  const match = path.match(ASSET_PATH);
  if (!match) continue;

  const [, category, slug] = match;
  let images = imagesByCategory.get(category);

  if (!images) {
    images = new Map();
    imagesByCategory.set(category, images);
  }

  images.set(slug, url);
}

/**
 * @param {string} category Asset folder name.
 * @param {string} slug Item name run through `slugFromName`.
 * @returns {string|null} Hashed image URL, or null when no image matches.
 */
export function getImage(category, slug) {
  return imagesByCategory.get(category)?.get(slug) ?? null;
}
