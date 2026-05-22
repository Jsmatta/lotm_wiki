import React from "react";
import WikiListPage from "../components/wikiListPage.jsx";

export default function Pathways({ selectedVolume }) {
  return (
    <WikiListPage
      selectedVolume={selectedVolume}
      category="pathways"
      title="Pathways"
      description="Browse extraordinary pathways, sequence progression, abilities, risks, and known historical context."
      routeBase="/pathways"
      emptyTitle="No pathways found"
      emptyDescription="No pathways are available for the selected volume."
    />
  );
}
