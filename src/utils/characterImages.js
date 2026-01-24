// Dynamic image loader for character images
// Automatically imports all images from assets/characters folder

// Use Vite's import.meta.glob to dynamically load all images
const imageModules = import.meta.glob('../assets/characters/*.{webp,jpg,jpeg,png}');

export async function getCharacterImages() {
  const images = {};
  
  // Load all image modules
  const loadedImages = await Promise.all(
    Object.entries(imageModules).map(async ([path, module]) => {
      const imgModule = await module();
      // Extract filename without extension
      const fileName = path.split('/').pop().split('.')[0];
      return { fileName, src: imgModule.default };
    })
  );
  
  // Build image map
  loadedImages.forEach(({ fileName, src }) => {
    images[fileName] = src;
  });
  
  return images;
}

// Simple path-based fallback (for cases where dynamic import fails)
export function getCharacterImagePath(fileName) {
  // Try common image extensions in order of preference
  const extensions = ['webp', 'jpg', 'jpeg', 'png'];
  
  for (const ext of extensions) {
    const path = `../assets/characters/${fileName}.${ext}`;
    try {
      // Try to require/import it
      return path;
    } catch (error) {
      continue;
    }
  }
  
  return null;
}