// Frontmatter parsing utilities for markdown files
// Simple browser-compatible frontmatter parser

export function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {
      data: {},
      content: content.trim()
    };
  }
  
  try {
    // Simple YAML-like parser for our basic needs
    const frontmatterText = match[1];
    const mainContent = match[2];
    const data = {};
    
    // Parse simple key: value pairs
    const lines = frontmatterText.split('\n');
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Convert to number if it looks like one
        if (!isNaN(value) && value !== '') {
          value = Number(value);
        }
        
        data[key] = value;
      }
    });
    
    return { data, content: mainContent.trim() };
  } catch (error) {
    console.error('Frontmatter parsing error:', error);
    return {
      data: {},
      content: content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '').trim()
    };
  }
}

export function processRevealBlocks(content, selectedVolume) {
  // Match reveal blocks: :::reveal at=2 ... :::
  const revealRegex = /:::reveal at=(\d+)\n([\s\S]*?):::/g
  
  let processedContent = content
  
  // Replace reveal blocks based on volume
  processedContent = processedContent.replace(revealRegex, (match, revealVolume, blockContent) => {
    const volume = parseInt(revealVolume)
    
    if (volume <= selectedVolume) {
      // Show the content if volume is reached
      return blockContent.trim()
    } else {
      // Hide the content if volume is not reached
      return ''
    }
  })
  
  return processedContent.trim()
}

export function parseMarkdownForReact(markdownContent, selectedVolumeIndex) {
  // Parse frontmatter
  const { data, content } = extractFrontmatter(markdownContent);
  
  // Process reveal blocks (using 0-indexed volumes)
  const processedContent = processRevealBlocks(content, selectedVolumeIndex);
  
  return {
    ...data,
    content: processedContent
  };
}

export function filterByVolume(items, selectedVolumeIndex) {
  // Keep 0-indexed for consistency with volume selector
  // Introduction is index 0, so characters introduced in Introduction should have introducedInVolume: 0
  return items.filter(item => item.introducedInVolume <= selectedVolumeIndex)
}