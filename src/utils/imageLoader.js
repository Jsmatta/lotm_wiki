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

// Extensions supported for each category
const categoryExtensions = {
  characters: ['webp', 'jpg', 'jpeg', 'png'],
  pathways: ['webp', 'jpg', 'jpeg', 'png', 'svg'],
  places: ['webp', 'jpg', 'jpeg', 'png'],
  gods: ['webp', 'jpg', 'jpeg', 'png', 'svg'],
  organizations: ['webp', 'jpg', 'jpeg', 'png', 'svg'],
  spells: ['webp', 'jpg', 'jpeg', 'png', 'svg'],
  sealed_artifacts: ['webp', 'jpg', 'jpeg', 'png', 'svg'],
  items: ['webp', 'jpg', 'jpeg', 'png'],
  symbols: ['webp', 'jpg', 'jpeg', 'png', 'svg']
};

export async function getImages(category = null) {
  const images = {};
  const categoriesToLoad = category ? [category] : Object.keys(assetModules);
  
  for (const cat of categoriesToLoad) {
    if (!assetModules[cat]) continue;
    
    const categoryImages = {};
    const modules = assetModules[cat];
    
    // Load all image modules for this category
    const loadedImages = await Promise.all(
      Object.entries(modules).map(async ([path, module]) => {
        const imgModule = await module();
        // Extract filename without extension
        const fileName = path.split('/').pop().split('.')[0];
        return { fileName, src: imgModule.default };
      })
    );
    
    // Build image map for this category
    loadedImages.forEach(({ fileName, src }) => {
      categoryImages[fileName] = src;
    });
    
    images[cat] = categoryImages;
  }
  
  return category ? images[category] || {} : images;
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

// Universal path-based fallback function
export function getImagePath(fileName, category) {
  if (!category || !categoryExtensions[category]) {
    console.warn(`Invalid category: ${category}`);
    return null;
  }
  
  const extensions = categoryExtensions[category];
  
  for (const ext of extensions) {
    const path = `../assets/${category}/${fileName}.${ext}`;
    try {
      return path;
    } catch (error) {
      continue;
    }
  }
  
  return null;
}

// Legacy fallback functions for backward compatibility
export function getCharacterImagePath(fileName) {
  return getImagePath(fileName, 'characters');
}

export function getPathwayImagePath(fileName) {
  return getImagePath(fileName, 'pathways');
}

export function getPlaceImagePath(fileName) {
  return getImagePath(fileName, 'places');
}

export function getGodImagePath(fileName) {
  return getImagePath(fileName, 'gods');
}

export function getItemImagePath(fileName) {
  return getImagePath(fileName, 'items');
}

export function getSymbolImagePath(fileName) {
  return getImagePath(fileName, 'symbols');
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
