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
      <main className="container mx-auto px-3 sm:px-6">
        <section className="bg-base-200 border-2 border-base-content brutal-shadow p-6 sm:p-8 mb-8">
          <div className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
            // ARCHIVE SEARCH ENGINE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase font-mono tracking-tight mt-1">
            Archive Search
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-base-content/80 font-mono leading-relaxed">
            {query
              ? `Displaying records matching query "${query}" (Quarantine: Volume ${selectedVolume}).`
              : "Enter a search term in the command bar to inspect the lore database."}
          </p>
        </section>

        {!query ? (
          <div className="bg-base-200 border-2 border-base-content brutal-shadow p-6 font-mono text-xs sm:text-sm">
            <span className="text-primary font-bold">[?] PROMPT:</span> Enter a character name, pathway, deity, or artifact in the navigation search bar.
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="bg-base-200 border-2 border-base-content brutal-shadow p-6 font-mono text-xs sm:text-sm">
            <span className="text-warning font-bold">[!] NO RECORDS FOUND:</span> No declassified records match "{query}" within Volume {selectedVolume}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="bg-base-200 border-2 border-base-content brutal-shadow brutal-card p-5 flex flex-col justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-base-content/10 pb-2 mb-3">
                    <span className="inline-block bg-accent text-accent-content font-mono text-[10px] font-bold px-1.5 py-0.5 border border-black uppercase">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-base-content/60">
                      VOL. {item.introducedInVolume}
                    </span>
                  </div>
                  <h2 className="font-mono font-bold text-lg uppercase tracking-tight group-hover:text-primary transition-colors">
                    {item.name}
                  </h2>
                </div>

                <div className="pt-2 border-t border-base-content/10 flex items-center justify-between font-mono text-xs font-bold text-primary group-hover:text-accent transition-colors">
                  <span>INSPECT RECORD</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
