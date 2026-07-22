import WikiListPage from "../components/wikiListPage.jsx";

export default function GodsPage(props) {
  return (
    <WikiListPage
      {...props}
      category="gods"
      title="Gods"
      description="Divine entities, powers, and cosmological forces from the series."
      routeBase="/gods"
      emptyTitle="No gods found"
      emptyDescription="Add markdown files under src/data/gods/ to populate this section."
    />
  );
}
