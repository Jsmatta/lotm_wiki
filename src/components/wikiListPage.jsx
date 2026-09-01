import { memo, useCallback, useDeferredValue, useMemo, useState } from "preact/compat";
import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { useAsyncData } from "../utils/useAsyncData.js";
import { getCategoryItems } from "../utils/wikiContent.js";
import { truncateText } from "../utils/textUtils.js";
import { getCategory } from "../config/categories.js";
import { ICON_PATHS } from "../config/icons.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import Icon from "./icon.jsx";
import LoadingPage from "./loadingPage.jsx";
import NotFoundPage from "../pages/notFound.jsx";

const EMPTY_ITEMS = [];

const WikiListCard = memo(function WikiListCard({ item, icon }) {
  const preview = useMemo(() => truncateText(item.plainText, 160), [item]);

  return (
    <Link
      to={item.href}
      className="bg-base-200 border-2 border-base-content brutal-shadow brutal-card flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        <figure className="h-48 overflow-hidden bg-base-300 border-b-2 border-base-content relative">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-base-300">
              <div className="text-center px-4">
                <Icon path={icon} className="h-12 w-12 mx-auto text-base-content/30 mb-2" />
                <span className="font-mono text-xs font-bold uppercase text-base-content/40">[NO RECORD PHOTO]</span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 border border-white/40 uppercase tracking-wider brutal-shadow-xs">
            VOL. {item.introducedInVolume}
          </div>
        </figure>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold font-mono uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
              {item.name}
            </h2>
          </div>

          <div className="inline-block bg-accent text-accent-content font-mono text-[10px] font-bold px-2 py-0.5 border border-black uppercase tracking-wider">
            {item.label}
          </div>

          {preview && (
            <p className="line-clamp-3 text-xs text-base-content/80 font-sans leading-relaxed">
              {preview}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-2.5 bg-base-100 border-t-2 border-base-content/20 flex items-center justify-between font-mono text-[11px] font-bold text-primary group-hover:text-accent transition-colors">
        <span>VIEW RECORD</span>
        <span>→</span>
      </div>
    </Link>
  );
});

/**
 * Grid and search view shared by every content category. Routed from
 * `src/app.jsx` with just a category key; all copy comes from the registry.
 */
export default function WikiListPage({ category }) {
  const config = getCategory(category);
  const selectedVolume = useSelectedVolume();
  const [query, setQuery] = useState("");
  // Typing stays responsive while the (potentially long) list re-filters.
  const deferredQuery = useDeferredValue(query);

  usePageTitle(config?.title);

  const load = useCallback(
    () => getCategoryItems(category, selectedVolume),
    [category, selectedVolume],
  );
  const { data: items, loading } = useAsyncData(load, [category, selectedVolume], EMPTY_ITEMS);

  const visibleItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    // `searchText` is pre-lowercased and memoized per item, so a keystroke is
    // one substring scan per entry rather than a rebuild of the haystack.
    return items.filter((item) => item.searchText.includes(normalizedQuery));
  }, [items, deferredQuery]);

  if (!config) {
    return <NotFoundPage />;
  }

  if (loading) {
    return <LoadingPage message={`Gathering ${config.title.toLowerCase()}…`} />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-3 sm:px-6">
        <section className="bg-base-200 border-2 border-base-content brutal-shadow p-6 sm:p-8 mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
                // ARCHIVE SECTION
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase font-mono tracking-tight mt-1">
                {config.title}
              </h1>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-base-content/80 font-mono leading-relaxed">
                {config.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="px-3 py-1.5 bg-base-100 border-2 border-base-content font-mono text-xs font-bold uppercase brutal-shadow-xs">
                  <span className="text-base-content/60">VISIBLE RECORDS: </span>
                  <span className="text-primary">{items.length}</span>
                </div>
                <div className="px-3 py-1.5 bg-base-100 border-2 border-base-content font-mono text-xs font-bold uppercase brutal-shadow-xs">
                  <span className="text-base-content/60">CLEARANCE: </span>
                  <span className="text-accent">VOL. {selectedVolume}</span>
                </div>
              </div>
            </div>

            <label className="input input-bordered rounded-none border-2 border-base-content focus-within:border-primary flex items-center gap-2 w-full lg:w-80 bg-base-100 brutal-shadow-xs">
              <Icon path={ICON_PATHS.search} className="h-4 w-4 opacity-70" />
              <input
                type="search"
                className="grow font-mono text-xs placeholder:uppercase focus:outline-none"
                placeholder={`Search ${config.title}...`}
                value={query}
                onInput={(event) => setQuery(event.currentTarget.value)}
              />
            </label>
          </div>
        </section>

        {items.length === 0 ? (
          <div className="bg-base-200 border-2 border-base-content brutal-shadow p-6 sm:p-8 flex items-center gap-4">
            <Icon path={config.icon} className="h-12 w-12 text-primary shrink-0" />
            <div>
              <h3 className="font-mono font-bold uppercase text-lg">No {config.title.toLowerCase()} cataloged</h3>
              <p className="font-mono text-xs text-base-content/70 mt-1">
                Add markdown files under src/data/{category}/ to populate this section.
              </p>
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="bg-base-200 border-2 border-base-content brutal-shadow p-6 sm:p-8 font-mono text-sm">
            <span className="text-warning font-bold">[!] NO ENTRIES MATCH QUERY:</span> "{deferredQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleItems.map((item) => (
              <WikiListCard key={item.id} item={item} icon={config.icon} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
