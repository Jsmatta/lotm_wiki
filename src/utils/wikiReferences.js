// The set of wiki pages that auto-linking may point at, for a given volume.

import { getCategoryEntries } from "./markdownLoader.js";
import { CATEGORIES } from "../config/categories.js";

let allReferences;

// Cached per volume so the array identity is stable across detail pages. The
// auto-link plugin keys its compiled regex off that identity, so every detail
// page at the same volume reuses one compiled pattern.
const referencesByVolume = new Map();

async function loadReferences() {
  const perCategory = await Promise.all(
    CATEGORIES.map(async ({ key, route }) => {
      const entries = await getCategoryEntries(key);

      return entries
        .filter((entry) => entry.name && Number.isFinite(entry.introducedInVolume))
        .map((entry) => ({
          id: entry.id,
          name: entry.name,
          introducedInVolume: entry.introducedInVolume,
          to: `${route}/${entry.id}`,
        }));
    }),
  );

  return perCategory.flat();
}

export function getWikiReferences(selectedVolume) {
  let pending = referencesByVolume.get(selectedVolume);

  if (!pending) {
    pending = (async () => {
      allReferences ??= loadReferences();
      const references = await allReferences;

      return references.filter(
        (reference) => reference.introducedInVolume <= selectedVolume,
      );
    })().catch((error) => {
      referencesByVolume.delete(selectedVolume);
      throw error;
    });

    referencesByVolume.set(selectedVolume, pending);
  }

  return pending;
}
