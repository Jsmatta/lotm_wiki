import React from "react";
import WikiListPage from "../components/wikiListPage.jsx";

export default function SealedArtifacts({ selectedVolume }) {
  return (
    <WikiListPage
      selectedVolume={selectedVolume}
      category="sealed_artifacts"
      title="Sealed Artifacts"
      description="Track dangerous artifacts, their observed effects, restrictions, and classification notes."
      routeBase="/sealed-artifacts"
      emptyTitle="No sealed artifacts found"
      emptyDescription="Add markdown files under src/data/sealed_artifacts/ to populate this section."
    />
  );
}
