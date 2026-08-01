import { useCallback, useMemo } from "preact/hooks";
import { Link, useLocation } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { useAsyncData } from "../utils/useAsyncData.js";
import { getAllItems } from "../utils/wikiContent.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import LoadingPage from "../components/loadingPage.jsx";

const EMPTY_ITEMS = [];

export default function SearchPage() {
  const selectedVolume = useSelectedVolume();
  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search).get("q") || "",
    [location.search],
  );

  usePageTitle("Search");

  const load = useCallback(() => getAllItems(selectedVolume), [selectedVolume]);
  const { data: items, loading } = useAsyncData(load, [selectedVolume], EMPTY_ITEMS);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return EMPTY_ITEMS;

    return items.filter((item) => item.searchText.includes(normalizedQuery));
  }, [items, query]);

  if (loading) {
    return <LoadingPage message="Building search index…" />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="bg-base-100/90 rounded-lg p-6 shadow-xl mb-8">
          <h1 className="text-4xl font-bold">Search</h1>
          <p className="mt-3 text-base-content/80">
            {query
              ? `Showing results for “${query}”.`
              : "Enter a search term in the navbar to look through the wiki."}
          </p>
        </section>

        {!query ? (
          <div className="alert alert-info bg-base-100/90">Search for a character, place, or concept.</div>
        ) : visibleItems.length === 0 ? (
          <div className="alert alert-warning bg-base-100/90">No results match “{query}”.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="card bg-base-100/90 border border-base-300 hover:border-accent"
              >
                <div className="card-body">
                  <h2 className="card-title text-lg">{item.name}</h2>
                  <div className="badge badge-secondary badge-sm capitalize">{item.label}</div>
                  <p className="text-sm text-base-content/80">Volume {item.introducedInVolume}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
