import React from "react";
import WikiDetailPage from "../components/wikiDetailPage.jsx";

export default function CharacterDetail({ selectedVolume }) {
  return (
    <WikiDetailPage
      selectedVolume={selectedVolume}
      category="characters"
      title="Characters"
      singularTitle="Character"
      routeBase="/characters"
      fallbackIconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  );
}
