import WikiDetailPage from "../components/wikiDetailPage.jsx";

export default function GodDetailPage(props) {
  return (
    <WikiDetailPage
      {...props}
      category="gods"
      title="Gods"
      routeBase="/gods"
      singularTitle="God"
      introductionLabel="Introduced In"
      imageCategory="gods"
      fallbackIconPath="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.365 2.444a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.444a1 1 0 00-1.176 0l-3.365 2.444c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L4.06 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.957z"
    />
  );
}
