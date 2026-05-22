import React from "react";
import WikiDetailPage from "../components/wikiDetailPage.jsx";

export default function SpellDetail({ selectedVolume }) {
  return (
    <WikiDetailPage
      selectedVolume={selectedVolume}
      category="spells"
      title="Spells"
      singularTitle="Spell"
      routeBase="/spells"
      fallbackIconPath="M13 10V3L4 14h7v7l9-11h-7z"
    />
  );
}
