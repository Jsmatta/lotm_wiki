import WikiListPage from "../components/wikiListPage.jsx";

export default function PlacesPage(props) {
  return (
    <WikiListPage
      {...props}
      category="places"
      title="Places"
      description="Locations, landmarks, and settings from the world of LOTM."
      routeBase="/places"
      emptyTitle="No places found"
      emptyDescription="Add markdown files under src/data/places/ to populate this section."
    />
  );
}
