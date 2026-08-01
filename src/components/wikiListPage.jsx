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
  const preview = useMemo(() => truncateText(item.plainText, 180), [item]);

  return (
    <Link
      to={item.href}
      className="card bg-base-100/95 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-accent/50 hover:border-accent group"
    >
      <figure className="h-48 overflow-hidden bg-base-200">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center px-4">
              <Icon path={icon} className="h-16 w-16 mx-auto text-base-content/30 mb-2" />
              <span className="text-base-content/50 text-sm">No Image</span>
            </div>
          </div>
        )}
      </figure>
      <div className="card-body gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="card-title text-lg group-hover:text-accent transition-colors">
            {item.name}
          </h2>
          <div className="badge badge-outline shrink-0">
            V{item.introducedInVolume}
          </div>
        </div>
        <div className="badge badge-secondary badge-sm">{item.label}</div>
        {preview && (
          <p className="line-clamp-4 text-sm text-base-content/80 leading-relaxed">
            {preview}
          </p>
        )}
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
      <main className="container mx-auto px-4 py-8">
        <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-6 shadow-xl mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">{config.title}</h1>
              <p className="mt-3 max-w-3xl text-base-content/80">
                {config.description}
              </p>
              <div className="stats stats-horizontal bg-base-200/70 mt-5 shadow-sm">
                <div className="stat py-3">
                  <div className="stat-title">Visible</div>
                  <div className="stat-value text-2xl">{items.length}</div>
                </div>
                <div className="stat py-3">
                  <div className="stat-title">Volume</div>
                  <div className="stat-value text-2xl">{selectedVolume}</div>
                </div>
              </div>
            </div>
            <label className="input input-bordered flex items-center gap-2 w-full lg:w-80">
              <Icon path={ICON_PATHS.search} className="h-4 w-4 opacity-70" />
              <input
                type="search"
                className="grow"
                placeholder={`Search ${config.title.toLowerCase()}`}
                value={query}
                onInput={(event) => setQuery(event.currentTarget.value)}
              />
            </label>
          </div>
        </section>

        {items.length === 0 ? (
          <div className="alert alert-info bg-base-100/90 backdrop-blur-sm">
            <Icon path={config.icon} className="h-16 w-16 text-base-content/30" />
            <div>
              <h3 className="font-bold">No {config.title.toLowerCase()} found</h3>
              <div className="text-sm">
                Add markdown files under src/data/{category}/ to populate this section.
              </div>
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="alert alert-warning bg-base-100/90 backdrop-blur-sm">
            <span>No results match "{deferredQuery}".</span>
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
