import { extractFrontmatter } from "./frontmatter.js";
import { getCategoryFiles } from "./markdownLoader.js";

const categoryRoutes = {
  characters: "/characters",
  pathways: "/pathways",
  places: "/places",
  gods: "/gods",
  organizations: "/organizations",
  spells: "/spells",
  sealed_artifacts: "/sealed-artifacts",
};

let referenceCache;

async function loadReferences() {
  const categoryEntries = await Promise.all(
    Object.entries(categoryRoutes).map(async ([category, routeBase]) => {
      const files = await getCategoryFiles(category);

      return Object.entries(files).map(([id, file]) => {
        const { data } = extractFrontmatter(file.content);

        return {
          id,
          name: data.name,
          introducedInVolume: Number(data.introducedInVolume),
          to: `${routeBase}/${id}`,
        };
      });
    }),
  );

  return categoryEntries
    .flat()
    .filter((reference) => reference.name && Number.isFinite(reference.introducedInVolume));
}

export async function getWikiReferences(selectedVolume, currentPath) {
  referenceCache ??= loadReferences();
  const references = await referenceCache;

  return references.filter(
    (reference) => (
      reference.introducedInVolume <= selectedVolume
      && reference.to !== currentPath
    ),
  );
}

