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

/** Warm raw markdown caches during idle time */
export function preloadAllCategories() {
  return Promise.all(
    Object.keys(categoryModules).map((category) => getCategoryFiles(category)),
  );
}
