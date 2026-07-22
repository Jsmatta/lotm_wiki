import WikiListPage from "../components/wikiListPage.jsx";

export default function SealedArtifactsPage(props) {
  return (
    <WikiListPage
      {...props}
      category="sealed_artifacts"
      title="Sealed Artifacts"
      description="Ancient relics, forbidden objects, and sealed mysteries."
      routeBase="/sealed-artifacts"
      emptyTitle="No sealed artifacts found"
      emptyDescription="Add markdown files under src/data/sealed_artifacts/ to populate this section."
    />
  );
}
