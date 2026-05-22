import React from "react";
import WikiListPage from "../components/wikiListPage.jsx";

export default function Spells({ selectedVolume }) {
  return (
    <WikiListPage
      selectedVolume={selectedVolume}
      category="spells"
      title="Spells"
      description="Keep notes on rituals, charms, divination methods, combat techniques, and mystical effects."
      routeBase="/spells"
      emptyTitle="No spells found"
      emptyDescription="Add markdown files under src/data/spells/ to populate this section."
    />
  );
}
