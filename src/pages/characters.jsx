import WikiListPage from "../components/wikiListPage.jsx";

export default function CharactersPage(props) {
  return (
    <WikiListPage
      {...props}
      category="characters"
      title="Characters"
      description="Profiles, relationships, and key moments for the series' most important figures."
      routeBase="/characters"
      emptyTitle="No characters found"
      emptyDescription="Add markdown files under src/data/characters/ to populate this section."
    />
  );
}
