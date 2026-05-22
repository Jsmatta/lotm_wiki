import React from "react";
import WikiListPage from "../components/wikiListPage.jsx";

export default function Characters({ selectedVolume }) {
  return (
    <WikiListPage
      selectedVolume={selectedVolume}
      category="characters"
      title="Characters"
      description="Track character profiles, affiliations, powers, and volume-gated developments without exposing later spoilers."
      routeBase="/characters"
      emptyTitle="No characters found"
      emptyDescription="No characters are available for the selected volume."
    />
  );
}
