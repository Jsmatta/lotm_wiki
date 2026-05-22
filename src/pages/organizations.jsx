import React from "react";
import WikiListPage from "../components/wikiListPage.jsx";

export default function Organizations({ selectedVolume }) {
  return (
    <WikiListPage
      selectedVolume={selectedVolume}
      category="organizations"
      title="Organizations"
      description="Review official churches, secret orders, investigative teams, noble factions, and their changing roles."
      routeBase="/organizations"
      emptyTitle="No organizations found"
      emptyDescription="Add markdown files under src/data/organizations/ to populate this section."
    />
  );
}
