import WikiListPage from "../components/wikiListPage.jsx";

export default function SpellsPage(props) {
  return (
    <WikiListPage
      {...props}
      category="spells"
      title="Spells"
      description="Rituals, incantations, and magical techniques from the lore."
      routeBase="/spells"
      emptyTitle="No spells found"
      emptyDescription="Add markdown files under src/data/spells/ to populate this section."
    />
  );
}
