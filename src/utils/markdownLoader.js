// Dynamic markdown loader for character and pathway files
// Automatically imports all markdown files from data directories

// Vite requires literal strings for import.meta.glob
const characterModules = import.meta.glob('../data/characters/*.md', { query: '?raw' });
const pathwayModules = import.meta.glob('../data/pathways/*.md', { query: '?raw' });

export async function getCategoryFiles(category) {
  let modules;
  
  if (category === 'characters') {
    modules = characterModules;
  } else if (category === 'pathways') {
    modules = pathwayModules;
  } else {
    return {};
  }
  
  const files = {};
  
  // Load all modules for this category
  const loadedFiles = await Promise.all(
    Object.entries(modules).map(async ([path, module]) => {
      const mdModule = await module();
      // Extract filename without extension
      const fileName = path.split('/').pop().replace(/\.[^/.]+$/, '');
      
      return { 
        fileName, 
        content: mdModule.default 
      };
    })
  );
  
  // Build file map
  loadedFiles.forEach(({ fileName, content }) => {
    files[fileName] = { content };
  });
  
  return files;
}