import WikiListPage from "../components/wikiListPage.jsx";

export default function OrganizationsPage(props) {
  return (
    <WikiListPage
      {...props}
      category="organizations"
      title="Organizations"
      description="Groups, factions, and institutions that shape the setting."
      routeBase="/organizations"
      emptyTitle="No organizations found"
      emptyDescription="Add markdown files under src/data/organizations/ to populate this section."
    />
  );
}
