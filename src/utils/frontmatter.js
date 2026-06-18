// Browser-compatible frontmatter and spoiler parsing utilities.

export function extractFrontmatter(content) {
  const normalizedContent = content.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const frontmatterRegex = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/;
  const match = normalizedContent.match(frontmatterRegex);
  
  if (!match) {
    return {
      data: {},
      content: normalizedContent.trim()
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
      content: normalizedContent.replace(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/, '').trim()
    };
  }
}

const spoilerOpeningRegex = /^[ \t]*:::(reveal|spoiler)\b(.*)$/i;
const spoilerClosingRegex = /^[ \t]*:::[ \t]*$/;
const volumeAttributeRegex = /(?:^|\s)(?:at|volume)\s*=\s*(?:"(\d+)"|'(\d+)'|(\d+))(?=\s|$)/i;
const codeFenceRegex = /^[ \t]*(`{3,}|~{3,})/;

function appendLines(target, lines) {
  if (lines.length > 0) {
    target.push(...lines);
  }
}

/**
 * Remove spoiler blocks that are beyond the selected reading volume.
 *
 * Supported opening directives:
 *   :::reveal at=2
 *   :::reveal at = "2"
 *   :::spoiler volume=2
 *
 * Blocks may be nested. Directives inside fenced code blocks are treated as
 * ordinary Markdown. Invalid or unclosed spoiler blocks fail closed so their
 * contents cannot leak.
 *
 * @param {string} content Markdown body without frontmatter.
 * @param {number} selectedVolumeIndex Zero-based volume selector index.
 * @param {{ warn?: (message: string) => void }} options Parser options.
 * @returns {string} Markdown safe to render for the selected volume.
 */
export function processRevealBlocks(
  content,
  selectedVolumeIndex,
  { warn = console.warn } = {},
) {
  const normalizedContent = content.replace(/\r\n?/g, "\n");
  const lines = normalizedContent.split("\n");
  const output = [];
  const stack = [];
  let activeFence = null;

  const currentTarget = () => (
    stack.length > 0 ? stack[stack.length - 1].lines : output
  );

  lines.forEach((line, index) => {
    const fenceMatch = line.match(codeFenceRegex);

    if (fenceMatch) {
      const marker = fenceMatch[1];
      const markerCharacter = marker[0];

      if (!activeFence) {
        activeFence = { character: markerCharacter, length: marker.length };
      } else if (
        markerCharacter === activeFence.character
        && marker.length >= activeFence.length
      ) {
        activeFence = null;
      }

      if (stack.length === 0 || stack[stack.length - 1].visible) {
        currentTarget().push(line);
      }
      return;
    }

    if (activeFence) {
      if (stack.length === 0 || stack[stack.length - 1].visible) {
        currentTarget().push(line);
      }
      return;
    }

    const openingMatch = line.match(spoilerOpeningRegex);

    if (openingMatch) {
      const volumeMatch = openingMatch[2].match(volumeAttributeRegex);
      const parentVisible = stack.length === 0 || stack[stack.length - 1].visible;
      const requiredVolume = volumeMatch
        ? Number(volumeMatch[1] ?? volumeMatch[2] ?? volumeMatch[3])
        : null;

      if (requiredVolume === null) {
        warn(
          `Invalid spoiler directive on line ${index + 1}; expected an "at" or "volume" number. Content was hidden.`,
        );
      }

      stack.push({
        line: index + 1,
        lines: [],
        visible: parentVisible
          && requiredVolume !== null
          && requiredVolume <= selectedVolumeIndex,
      });
      return;
    }

    if (spoilerClosingRegex.test(line) && stack.length > 0) {
      const completedBlock = stack.pop();

      if (completedBlock.visible) {
        appendLines(currentTarget(), completedBlock.lines);
      }
      return;
    }

    if (stack.length === 0 || stack[stack.length - 1].visible) {
      currentTarget().push(line);
    }
  });

  if (stack.length > 0) {
    stack.forEach((block) => {
      warn(
        `Unclosed spoiler directive starting on line ${block.line}. Content was hidden.`,
      );
    });
  }

  return output.join("\n").trim();
}

export function parseMarkdownForReact(markdownContent, selectedVolumeIndex) {
  const { data, content } = extractFrontmatter(markdownContent);
  const processedContent = processRevealBlocks(content, selectedVolumeIndex);
  
  return {
    ...data,
    content: processedContent
  };
}

export function filterByVolume(items, selectedVolumeIndex) {
  return items.filter((item) => {
    const introducedInVolume = Number(item.introducedInVolume);
    return Number.isFinite(introducedInVolume)
      && introducedInVolume <= selectedVolumeIndex;
  });
}
