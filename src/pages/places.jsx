import React from "react";
import WikiListPage from "../components/wikiListPage.jsx";

export default function Places({ selectedVolume }) {
  return (
    <WikiListPage
      selectedVolume={selectedVolume}
      category="places"
      title="Places"
      description="Explore important cities, landmarks, regions, and hidden locations as they become relevant in the story."
      routeBase="/places"
      emptyTitle="No places found"
      emptyDescription="Add markdown files under src/data/places/ to populate this section."
    />
  );
}
