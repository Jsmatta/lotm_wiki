/** Slugify a display name for image lookup */
export function slugFromName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

/** Strip markdown syntax so snippets show clean prose */
export function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/:::reveal[^]*?:::/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*>]\s+/gm, "")
    .replace(/\n{2,}/g, " ")
    .trim();
}

/** Truncate plain text for card previews */
export function truncateText(text, maxLength = 200) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}
