import WikiListPage from "../components/wikiListPage.jsx";

export default function PathwaysPage(props) {
  return (
    <WikiListPage
      {...props}
      category="pathways"
      title="Pathways"
      description="Explore the routes, systems, and connections that shape the wiki's lore."
      routeBase="/pathways"
      emptyTitle="No pathways found"
      emptyDescription="Add markdown files under src/data/pathways/ to populate this section."
    />
  );
}
