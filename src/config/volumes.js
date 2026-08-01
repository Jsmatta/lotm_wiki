// Canonical, zero-indexed volume list. Index 0 is "Introduction", so a volume
// index is directly comparable to `introducedInVolume` frontmatter and to the
// `at=N` / `volume=N` attribute on spoiler blocks.
export const VOLUMES = [
  "Introduction",
  "The Clown",
  "The Faceless",
  "The Traveler",
  "The Undying",
  "The Red Priest",
  "The Lightseeker",
  "The Hanged Man",
  "The Fool",
];

export const FIRST_VOLUME = 0;
export const LAST_VOLUME = VOLUMES.length - 1;

/**
 * Coerce anything (localStorage strings, stale indexes from a shorter volume
 * list, NaN) into a valid volume index. Falls back to the spoiler-free start
 * rather than to a value that would reveal content.
 */
export function clampVolume(value) {
  const index = Number(value);

  if (!Number.isFinite(index)) return FIRST_VOLUME;

  return Math.min(Math.max(Math.trunc(index), FIRST_VOLUME), LAST_VOLUME);
}

export function volumeTitle(index) {
  return VOLUMES[clampVolume(index)];
}
