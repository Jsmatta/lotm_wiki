// Universal image loader for all wiki content
// Supports characters, pathways, places, gods, and any other categories

// Dynamic imports for different asset categories
const assetModules = {
  characters: import.meta.glob('../assets/characters/*.{webp,jpg,jpeg,png}'),
  pathways: import.meta.glob('../assets/pathways/*.{webp,jpg,jpeg,png,svg}'),
  places: import.meta.glob('../assets/places/*.{webp,jpg,jpeg,png}'),
  gods: import.meta.glob('../assets/gods/*.{webp,jpg,jpeg,png,svg}'),
  organizations: import.meta.glob('../assets/organizations/*.{webp,jpg,jpeg,png,svg}'),
  spells: import.meta.glob('../assets/spells/*.{webp,jpg,jpeg,png,svg}'),
  sealed_artifacts: import.meta.glob('../assets/sealed_artifacts/*.{webp,jpg,jpeg,png,svg}'),
  items: import.meta.glob('../assets/items/*.{webp,jpg,jpeg,png}'),
  symbols: import.meta.glob('../assets/symbols/*.{webp,jpg,jpeg,png,svg}')
};

const imageCache = new Map();
const allImagesCacheKey = "__all__";

async function loadImagesForCategories(categoriesToLoad) {
  const images = {};

  for (const cat of categoriesToLoad) {
    if (!assetModules[cat]) continue;

    const categoryImages = {};
    const modules = assetModules[cat];

    const loadedImages = await Promise.all(
      Object.entries(modules).map(async ([path, module]) => {
        const imgModule = await module();
        const fileName = path.split("/").pop().split(".")[0];
        return { fileName, src: imgModule.default };
      }),
    );

    loadedImages.forEach(({ fileName, src }) => {
      categoryImages[fileName] = src;
    });

    images[cat] = categoryImages;
  }

  return images;
}

export async function getImages(category = null) {
  const cacheKey = category ?? allImagesCacheKey;

  if (!imageCache.has(cacheKey)) {
    const categoriesToLoad = category ? [category] : Object.keys(assetModules);
    imageCache.set(cacheKey, loadImagesForCategories(categoriesToLoad));
  }

  try {
    const images = await imageCache.get(cacheKey);
    return category ? images[category] || {} : images;
  } catch (error) {
    imageCache.delete(cacheKey);
    throw error;
  }
}

/** Warm image caches during idle time */
export function preloadAllImages() {
  return getImages();
}

// Get images for specific category
export async function getCharacterImages() {
  return getImages('characters');
}

export async function getPathwayImages() {
  return getImages('pathways');
}

export async function getPlaceImages() {
  return getImages('places');
}

export async function getGodImages() {
  return getImages('gods');
}

export async function getItemImages() {
  return getImages('items');
}

export async function getSymbolImages() {
  return getImages('symbols');
}

// Helper function to get image with automatic category detection
export async function getImage(fileName, category = null) {
  if (category) {
    const images = await getImages(category);
    return images[fileName] || null;
  }
  
  // If no category specified, search all categories
  const allImages = await getImages();
  for (const [cat, images] of Object.entries(allImages)) {
    if (images[fileName]) {
      return images[fileName];
    }
  }
  
  return null;
}

// Get all available categories
export function getAvailableCategories() {
  return Object.keys(assetModules);
}
