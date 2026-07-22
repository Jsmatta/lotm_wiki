import { useMemo, useState, useEffect } from "preact/hooks";
import { Link, useLocation } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { getAllCategoryItems } from "../utils/wikiContent.js";
import LoadingPage from "../components/loadingPage.jsx";

export default function SearchPage({ selectedVolume }) {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useMemo(() => new URLSearchParams(location.search).get("q") || "", [location.search]);

  usePageTitle("Search");

  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      setLoading(true);
      try {
        const allItems = await getAllCategoryItems(selectedVolume);
        if (!cancelled) setItems(allItems);
      } catch (error) {
        console.error("Error loading search index:", error);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadItems();
    return () => { cancelled = true; };
  }, [selectedVolume]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return items.filter((item) =>
      `${item.name} ${item.category} ${item.plainText}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
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
            {query ? `Showing results for “${query}”.` : "Enter a search term in the navbar to look through the wiki."}
          </p>
        </section>

        {!query ? (
          <div className="alert alert-info bg-base-100/90">Search for a character, place, or concept.</div>
        ) : visibleItems.length === 0 ? (
          <div className="alert alert-warning bg-base-100/90">No results match “{query}”.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleItems.map((item) => (
              <Link key={`${item.category}-${item.id}`} to={`/${item.category}/${item.id}`} className="card bg-base-100/90 border border-base-300 hover:border-accent">
                <div className="card-body">
                  <h2 className="card-title text-lg">{item.name}</h2>
                  <div className="badge badge-secondary badge-sm capitalize">{item.category}</div>
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
