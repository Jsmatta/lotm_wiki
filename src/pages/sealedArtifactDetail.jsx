import React from "react";
import WikiDetailPage from "../components/wikiDetailPage.jsx";

export default function SealedArtifactDetail({ selectedVolume }) {
  return (
    <WikiDetailPage
      selectedVolume={selectedVolume}
      category="sealed_artifacts"
      imageCategory="items"
      title="Sealed Artifacts"
      singularTitle="Sealed Artifact"
      routeBase="/sealed-artifacts"
      fallbackIconPath="M12 11c0-1.105-.895-2-2-2S8 9.895 8 11s.895 2 2 2 2-.895 2-2zm0 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm-2 0H5m14 0h-5"
    />
  );
}
