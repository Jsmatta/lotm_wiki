function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createReferencePattern(references) {
  const names = references
    .map((reference) => reference.name)
    .sort((first, second) => second.length - first.length)
    .map(escapeRegExp);

  return names.length > 0
    ? new RegExp(`(^|[^A-Za-z0-9])(${names.join("|")})(?=$|[^A-Za-z0-9])`, "gi")
    : null;
}

function linkTextNode(node, referencesByName, pattern) {
  const nodes = [];
  let lastIndex = 0;
  let match;

  pattern.lastIndex = 0;

  while ((match = pattern.exec(node.value)) !== null) {
    const leadingText = match[1];
    const linkedText = match[2];
    const linkedTextIndex = match.index + leadingText.length;
    const reference = referencesByName.get(linkedText.toLowerCase());

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

    if (match[0].length === 0) {
      pattern.lastIndex += 1;
    }
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

export function remarkAutoLinkReferences(references = []) {
  const referencesByName = new Map(
    references.map((reference) => [reference.name.toLowerCase(), reference]),
  );
  const pattern = createReferencePattern(references);

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
          return linkTextNode(child, referencesByName, pattern);
        }

        visit(child);
        return child;
      });
    };

    visit(tree);
  };
}

