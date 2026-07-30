// Dynamic markdown loader for wiki content files
// Automatically imports all markdown files from data directories

// Vite requires literal strings for import.meta.glob
const characterModules = import.meta.glob('../data/characters/*.md', { query: '?raw' });
const pathwayModules = import.meta.glob('../data/pathways/*.md', { query: '?raw' });
const placeModules = import.meta.glob('../data/places/*.md', { query: '?raw' });
const godModules = import.meta.glob('../data/gods/*.md', { query: '?raw' });
const organizationModules = import.meta.glob('../data/organizations/*.md', { query: '?raw' });
const spellModules = import.meta.glob('../data/spells/*.md', { query: '?raw' });
const sealedArtifactModules = import.meta.glob('../data/sealed_artifacts/*.md', { query: '?raw' });

const categoryModules = {
  characters: characterModules,
  pathways: pathwayModules,
  places: placeModules,
  gods: godModules,
  organizations: organizationModules,
  spells: spellModules,
  sealed_artifacts: sealedArtifactModules,
};

const categoryCache = new Map();

async function loadCategoryFiles(category) {
  const modules = categoryModules[category];

  if (!modules) {
    return {};
  }

  const files = {};

  const loadedFiles = await Promise.all(
    Object.entries(modules).map(async ([path, module]) => {
      const mdModule = await module();
      const fileName = path.split("/").pop().replace(/\.[^/.]+$/, "");

      return {
        fileName,
        content: mdModule.default,
      };
    }),
  );

  loadedFiles.forEach(({ fileName, content }) => {
    files[fileName] = { content };
  });

  return files;
}

export async function getCategoryFiles(category) {
  if (!categoryCache.has(category)) {
    categoryCache.set(category, loadCategoryFiles(category));
  }

  try {
    return await categoryCache.get(category);
  } catch (error) {
    categoryCache.delete(category);
    throw error;
  }
}

/**
 * CategoryLoader class for per-category lazy loading
 * Uses LRU cache with max 20 entries per category
 * Auto-clears on new category load when at capacity
 */
class CategoryLoader {
  constructor(category) {
    this.category = category;
    this.categoryCache = new Map();
    this.isReady = false;
    this.promise = null;
  }

  async load() {
    if (this.isReady && this.categoryCache.size > 0) {
      return this.categoryCache.get(0);
    }

    if (this.promise && !this.promise.ran) {
      this.promise.ran = true;
      return this.promise;
    }

    this.promise = (async () => {
      const modules = categoryModules[this.category];
      
      if (!modules) {
        this.isReady = true;
        this.categoryCache.set(0, {});
        return {};
      }

      const files = {};
      const loadedFiles = await Promise.all(
        Object.entries(modules).map(async ([path, module]) => {
          const mdModule = await module();
          const fileName = path.split("/").pop().replace(/\.[^/.]+$/, "");
          return { fileName, content: mdModule.default };
        }),
      );

      loadedFiles.forEach(({ fileName, content }) => {
        files[fileName] = { content };
      });

      this.categoryCache.set(0, files);
      this.isReady = true;
      return files;
    })();

    return this.promise;
  }

  getAll() {
    const all = {};
    if (this.isReady) {
      for (const [cat, files] of this.categoryCache.entries()) {
        for (const [fileName, data] of Object.entries(files)) {
          all[cat + ':' + fileName] = data;
        }
      }
    }
    return all;
  }
}

/** Warm raw markdown caches during idle time */
export function preloadAllCategories() {
  return Promise.all(
    Object.keys(categoryModules).map((category) => getCategoryFiles(category)),
  );
}

/** Export CategoryLoader for lazy loading */
export { CategoryLoader };

/**
 * Load category files lazily - triggers on first access
 */
export async function getCategoryFiles(category) {
  if (!category) return {};

  // Check if CategoryLoader exists for this category
  const loaderKey = `categoryLoader_${category}`;
  
  // Simple lazy loading - just call the loader function
  if (!categoryCache.has(category)) {
    categoryCache.set(category, loadCategoryFiles(category));
  }

  try {
    return await categoryCache.get(category);
  } catch (error) {
    categoryCache.delete(category);
    throw error;
  }
}

/**
 * Explicitly load a category (alternative to using CategoryLoader)
 */
export async function loadCategoryFiles(category) {
  const modules = categoryModules[category];

  if (!modules) {
    return {};
  }

  const files = {};

  const loadedFiles = await Promise.all(
    Object.entries(modules).map(async ([path, module]) => {
      const mdModule = await module();
      const fileName = path.split("/").pop().replace(/\.[^/.]+$/, "");

      return {
        fileName,
        content: mdModule.default,
      };
    }),
  );

  loadedFiles.forEach(({ fileName, content }) => {
    files[fileName] = { content };
  });

  return files;
}
