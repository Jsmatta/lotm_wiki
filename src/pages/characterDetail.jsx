import WikiDetailPage from "../components/wikiDetailPage.jsx";

export default function CharacterDetailPage(props) {
  return (
    <WikiDetailPage
      {...props}
      category="characters"
      title="Characters"
      routeBase="/characters"
      singularTitle="Character"
      introductionLabel="Introduced In"
      imageCategory="characters"
      fallbackIconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  );
}
