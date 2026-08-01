// Remark plugin that turns bare mentions of other wiki pages into links.

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createReferencePattern(references) {
  // Longest name first so "Church of the Evernight Goddess" wins over the
  // "Evernight Goddess" it contains.
  const names = references
    .map((reference) => reference.name)
    .sort((first, second) => second.length - first.length)
    .map(escapeRegExp);

  return names.length > 0
    ? new RegExp(`(^|[^A-Za-z0-9])(${names.join("|")})(?=$|[^A-Za-z0-9])`, "gi")
    : null;
}

// Building the alternation over every wiki page is the expensive part, and the
// reference list is cached per volume upstream — so keying the compiled form on
// the array identity means one compile per volume instead of one per page view.
const compiledCache = new WeakMap();

function compile(references) {
  let compiled = compiledCache.get(references);

  if (!compiled) {
    compiled = {
      byName: new Map(
        references.map((reference) => [reference.name.toLowerCase(), reference]),
      ),
      pattern: createReferencePattern(references),
    };
    compiledCache.set(references, compiled);
  }

  return compiled;
}

function linkTextNode(node, byName, pattern, currentPath) {
  const nodes = [];
  let lastIndex = 0;
  let match;

  pattern.lastIndex = 0;

  while ((match = pattern.exec(node.value)) !== null) {
    const leadingText = match[1];
    const linkedText = match[2];
    const linkedTextIndex = match.index + leadingText.length;
    const reference = byName.get(linkedText.toLowerCase());

    if (match[0].length === 0) {
      pattern.lastIndex += 1;
    }

    // Leave the text alone when it names the page we are already on.
    if (!reference || reference.to === currentPath) {
      continue;
    }

    if (linkedTextIndex > lastIndex) {
      nodes.push({
        type: "text",
        value: node.value.slice(lastIndex, linkedTextIndex),
      });
    }

    nodes.push({
      type: "link",
      url: reference.to,
      children: [{ type: "text", value: linkedText }],
    });

    lastIndex = linkedTextIndex + linkedText.length;
  }

  if (nodes.length === 0) {
    return [node];
  }

  if (lastIndex < node.value.length) {
    nodes.push({
      type: "text",
      value: node.value.slice(lastIndex),
    });
  }

  return nodes;
}

const ignoredNodeTypes = new Set([
  "code",
  "inlineCode",
  "link",
  "linkReference",
  "definition",
  "html",
]);

/**
 * @param {Array<{name: string, to: string}>} references Linkable wiki pages.
 * @param {{currentPath?: string|null}} options `currentPath` is left unlinked.
 */
export function remarkAutoLinkReferences(references = [], { currentPath = null } = {}) {
  const { byName, pattern } = compile(references);

  return () => (tree) => {
    if (!pattern) {
      return;
    }

    const visit = (node) => {
      if (ignoredNodeTypes.has(node.type) || !Array.isArray(node.children)) {
        return;
      }

      node.children = node.children.flatMap((child) => {
        if (child.type === "text") {
          return linkTextNode(child, byName, pattern, currentPath);
        }

        visit(child);
        return child;
      });
    };

    visit(tree);
  };
}
