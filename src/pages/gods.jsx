import React from "react";
import WikiListPage from "../components/wikiListPage.jsx";

export default function Gods({ selectedVolume }) {
  return (
    <WikiListPage
      selectedVolume={selectedVolume}
      category="gods"
      title="Gods"
      description="Catalog deities, authorities, churches, symbols, and divine influence as the story reveals them."
      routeBase="/gods"
      emptyTitle="No gods found"
      emptyDescription="Add markdown files under src/data/gods/ to populate this section."
    />
  );
}
