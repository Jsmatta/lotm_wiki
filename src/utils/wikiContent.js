import { getCategoryFiles } from "./markdownLoader.js";
import { getImages } from "./imageLoader.js";
import { parseMarkdownForReact, filterByVolume } from "./frontmatter.js";
import { slugFromName, stripMarkdown } from "./textUtils.js";

const itemsCache = new Map();
const PARSE_CHUNK_SIZE = 12;

const ALL_CATEGORIES = [
  "characters",
  "pathways",
  "places",
  "gods",
  "organizations",
  "spells",
  "sealed_artifacts",
];

function yieldToMain() {
  return new Promise((resolve) => {
    if (typeof scheduler !== "undefined" && typeof scheduler.yield === "function") {
      scheduler.yield().then(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });
}

function resolveImage(imageMap, imageKey) {
  return (
    imageMap[imageKey]
    || (imageKey === "klein_moretti" ? imageMap.klein_morreti : null)
    || null
  );
}

function buildItem(slug, file, selectedVolume, imageMap, category) {
  const parsed = parseMarkdownForReact(file.content, selectedVolume);
  const imageKey = slugFromName(parsed.name || "");
  const content = parsed.content || "";

  return {
    id: slug,
    name: parsed.name || "Untitled",
    introducedInVolume: parsed.introducedInVolume ?? 0,
    category: parsed.category || category,
    content,
    plainText: stripMarkdown(content),
    image: resolveImage(imageMap, imageKey),
  };
}

async function parseCategoryEntries(categoryFiles, selectedVolume, imageMap, category) {
  const entries = Object.entries(categoryFiles);
  const results = [];

  for (let i = 0; i < entries.length; i += PARSE_CHUNK_SIZE) {
    const chunk = entries.slice(i, i + PARSE_CHUNK_SIZE);

    for (const [slug, file] of chunk) {
      results.push(buildItem(slug, file, selectedVolume, imageMap, category));
    }

    if (i + PARSE_CHUNK_SIZE < entries.length) {
      await yieldToMain();
    }
  }

  return filterByVolume(results, selectedVolume);
}

export async function getCategoryItems(category, selectedVolume, imageCategory = category) {
  const cacheKey = `${category}:${selectedVolume}:${imageCategory}`;

  if (!itemsCache.has(cacheKey)) {
    const promise = (async () => {
      const [categoryFiles, imageMap] = await Promise.all([
        getCategoryFiles(category),
        getImages(imageCategory),
      ]);

      return parseCategoryEntries(categoryFiles, selectedVolume, imageMap, category);
    })();

    itemsCache.set(cacheKey, promise);
  }

  try {
    return await itemsCache.get(cacheKey);
  } catch (error) {
    itemsCache.delete(cacheKey);
    throw error;
  }
}

export async function getCategoryItem(category, id, selectedVolume, imageCategory = category) {
  const [categoryFiles, imageMap] = await Promise.all([
    getCategoryFiles(category),
    getImages(imageCategory),
  ]);

  const file = categoryFiles[id];
  if (!file) return null;

  const item = buildItem(id, file, selectedVolume, imageMap, category);

  if (item.introducedInVolume > selectedVolume) {
    return null;
  }

  return item;
}

export async function getAllCategoryItems(selectedVolume) {
  const cacheKey = `__all__:${selectedVolume}`;

  if (!itemsCache.has(cacheKey)) {
    const promise = (async () => {
      const imageMap = await getImages();

      const categoryEntries = await Promise.all(
        ALL_CATEGORIES.map(async (category) => {
          const files = await getCategoryFiles(category);
          const items = await parseCategoryEntries(
            files,
            selectedVolume,
            imageMap[category] || {},
            category,
          );

          return items.map((item) => ({ ...item, category }));
        }),
      );

      return categoryEntries.flat();
    })();

    itemsCache.set(cacheKey, promise);
  }

  try {
    return await itemsCache.get(cacheKey);
  } catch (error) {
    itemsCache.delete(cacheKey);
    throw error;
  }
}
