import { ICON_PATHS } from "./icons.js";

/**
 * Single source of truth for every content category.
 *
 * To add a category: append one entry here, create `src/data/<key>/` with
 * markdown files and `src/assets/<key>/` with images. The markdown and image
 * loaders discover the folders by glob, and `src/app.jsx` generates the list
 * and detail routes — no other file needs to change.
 *
 * - `key`   folder name under `src/data/` and `src/assets/`
 * - `route` URL segment, which may differ from the folder name
 */
export const CATEGORIES = [
  {
    key: "characters",
    route: "/characters",
    title: "Characters",
    singular: "Character",
    description:
      "Profiles, relationships, and key moments for the series' most important figures.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    key: "places",
    route: "/places",
    title: "Places",
    singular: "Place",
    description: "Locations, landmarks, and settings from the world of LOTM.",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
  },
  {
    key: "pathways",
    route: "/pathways",
    title: "Pathways",
    singular: "Pathway",
    description:
      "Explore the routes, systems, and connections that shape the wiki's lore.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    key: "gods",
    route: "/gods",
    title: "Gods",
    singular: "God",
    description: "Divine entities, powers, and cosmological forces from the series.",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.365 2.444a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.444a1 1 0 00-1.176 0l-3.365 2.444c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L4.06 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.957z",
  },
  {
    key: "organizations",
    route: "/organizations",
    title: "Organizations",
    singular: "Organization",
    description: "Groups, factions, and institutions that shape the setting.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    key: "spells",
    route: "/spells",
    title: "Spells",
    singular: "Spell",
    description: "Rituals, incantations, and magical techniques from the lore.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    key: "sealed_artifacts",
    route: "/sealed-artifacts",
    title: "Sealed Artifacts",
    singular: "Sealed Artifact",
    description: "Ancient relics, forbidden objects, and sealed mysteries.",
    icon: "M12 11c0-1.105-.895-2-2-2S8 9.895 8 11s.895 2 2 2 2-.895 2-2zm0 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm-2 0H5m14 0h-5",
  },
];

export const CATEGORY_KEYS = CATEGORIES.map((category) => category.key);

const byKey = new Map(CATEGORIES.map((category) => [category.key, category]));

export function getCategory(key) {
  return byKey.get(key) ?? null;
}

/** Nav entries: the static pages first, then one per content category. */
export const NAV_SECTIONS = [
  { label: "Home", path: "/", icon: ICON_PATHS.home },
  { label: "Volumes", path: "/volumes", icon: ICON_PATHS.volumes },
  ...CATEGORIES.map((category) => ({
    label: category.title,
    path: category.route,
    icon: category.icon,
  })),
];

/** Everything the home page offers as a browsable card (i.e. not Home itself). */
export const EXPLORE_SECTIONS = NAV_SECTIONS.slice(1);
