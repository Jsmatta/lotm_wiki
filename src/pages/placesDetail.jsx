import React from "react";
import WikiDetailPage from "../components/wikiDetailPage.jsx";

export default function PlacesDetail({ selectedVolume }) {
  return (
    <WikiDetailPage
      selectedVolume={selectedVolume}
      category="places"
      title="Places"
      singularTitle="Place"
      routeBase="/places"
      fallbackIconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
  );
}
