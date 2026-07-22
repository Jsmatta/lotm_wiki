import WikiDetailPage from "../components/wikiDetailPage.jsx";

export default function SealedArtifactDetailPage(props) {
  return (
    <WikiDetailPage
      {...props}
      category="sealed_artifacts"
      title="Sealed Artifacts"
      routeBase="/sealed-artifacts"
      singularTitle="Sealed Artifact"
      introductionLabel="Introduced In"
      imageCategory="sealed_artifacts"
      fallbackIconPath="M12 11c0-1.105-.895-2-2-2S8 9.895 8 11s.895 2 2 2 2-.895 2-2zm0 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm-2 0H5m14 0h-5"
    />
  );
}
