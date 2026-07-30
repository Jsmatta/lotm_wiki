// Universal image loader for all wiki content
// Supports characters, pathways, places, gods, and any other categories
// Implements lazy loading with progressive loading strategy

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

// Track loading state for progressive loading
const loadingPromises = new Map();
const loadedCategories = new Set();

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

export async function loadImages(category = null) {
  const cacheKey = category ?? allImagesCacheKey;
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }

  if (loadedCategories.has(category) && category) {
    return imageCache.get(allImagesCacheKey)?.[category] || {};
  }

  const promise = (async () => {
    const categoriesToLoad = category ? [category] : Object.keys(assetModules);
    imageCache.set(cacheKey, loadImagesForCategories(categoriesToLoad));
    
    if (category) {
      loadedCategories.add(category);
    }
    
    const images = await imageCache.get(cacheKey);
    return category ? images[category] || {} : images;
  })();

  loadingPromises.set(cacheKey, promise);
  return promise;
}

/** Get a single image by source */
export function getImage(src) {
  // Check if we have this specific image cached
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }
  return null;
}

/**
 * Load a single image with placeholder and return a Promise
 * Usage: const imgPromise = loadImage('/characters/klein.webp');
 */
export async function loadImage(src) {
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }
  
  // Create placeholder
  const placeholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600' style='background:linear-gradient(135deg,%23cbd5e1 0%2C%23e2e8f0 100%)'%3E%3Crect width='400' height='600' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%2364748b' text-anchor='middle'%3EImage loading...%3C/text%3E%3C/svg%3E`;
  
  const promise = (async () => {
    try {
      // Check cache first
      if (imageCache.has(src)) {
        return imageCache.get(src);
      }
      
      // Try to get from category
      const category = src.split('/').pop()?.split('.').slice(0, -1).join('.');
      if (category) {
        const images = await getImages(category);
        if (images[category === category] || images[category]) {
          const result = images[category] || images[category];
          if (result && !imageCache.has(src)) {
            imageCache.set(src, result);
          }
          return result;
        }
      }
      
      // Fallback: return placeholder
      return src.startsWith('data:') ? src : placeholder;
    } catch (error) {
      return src.startsWith('data:') ? src : placeholder;
    }
  })();
  
  return promise;
}

/**
 * Load all images in a category with progressive loading
 * Main images first, then related images progressively
 */
export async function loadImagesProgressive(category = null) {
  const cacheKey = category ?? allImagesCacheKey;
  const results = {};

  if (loadingPromises.has(cacheKey)) {
    results.loading = loadingPromises.get(cacheKey);
    results.loaded = {};
    return { loading: results.loading, loaded: results.loaded, total: Object.keys(results.loaded).length };
  }

  const categoriesToLoad = category ? [category] : Object.keys(assetModules);
  const promise = (async () => {
    // Warm up the cache
    const allImages = await loadImagesForCategories(categoriesToLoad);
    
    // Progressive loading: return empty first, fill as images load
    results.loaded = allImages;
    imageCache.set(cacheKey, allImages);
    
    return { allImages: allImages[category] || allImages };
  })();

  loadingPromises.set(cacheKey, promise);
  return { loading: loadingPromises.get(cacheKey), loaded: results.loaded };
}

export { assetModules };
