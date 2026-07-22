import WikiDetailPage from "../components/wikiDetailPage.jsx";

export default function SpellDetailPage(props) {
  return (
    <WikiDetailPage
      {...props}
      category="spells"
      title="Spells"
      routeBase="/spells"
      singularTitle="Spell"
      introductionLabel="Introduced In"
      imageCategory="spells"
      fallbackIconPath="M13 10V3L4 14h7v7l9-11h-7z"
    />
  );
}
