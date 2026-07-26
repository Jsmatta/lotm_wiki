import { memo, useEffect, useMemo, useState } from "preact/compat";
import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { getCategoryItems } from "../utils/wikiContent.js";
import { truncateText } from "../utils/textUtils.js";
import { categoryIconPaths, defaultCategoryIconPath } from "../utils/categoryIcons.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import LoadingPage from "./loadingPage.jsx";

function EmptyIcon({ category }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 mx-auto text-base-content/30 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={categoryIconPaths[category] || defaultCategoryIconPath}
      />
    </svg>
  );
}

const WikiListCard = memo(function WikiListCard({ item, category, routeBase }) {
  const preview = useMemo(
    () => truncateText(item.plainText, 180),
    [item.plainText],
  );

  return (
    <Link
      to={`${routeBase}/${item.id}`}
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
              <EmptyIcon category={category} />
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
        <div className="badge badge-secondary badge-sm">{item.category}</div>
        {preview && (
          <p className="line-clamp-4 text-sm text-base-content/80 leading-relaxed">
            {preview}
          </p>
        )}
      </div>
    </Link>
  );
});

export default function WikiListPage({
  category,
  title,
  description,
  routeBase,
  imageCategory = category,
  emptyTitle,
  emptyDescription,
}) {
  const selectedVolume = useSelectedVolume();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  usePageTitle(title);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);

      try {
        const itemData = await getCategoryItems(category, selectedVolume, imageCategory);
        if (!cancelled) {
          setItems(itemData);
        }
      } catch (error) {
        console.error(`Error loading ${category}:`, error);
        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [category, imageCategory, selectedVolume]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      `${item.name} ${item.category} ${item.plainText}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [items, query]);

  if (loading) {
    return <LoadingPage message={`Gathering ${title.toLowerCase()}…`} />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-6 shadow-xl mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">{title}</h1>
              {description && (
                <p className="mt-3 max-w-3xl text-base-content/80">
                  {description}
                </p>
              )}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                className="grow"
                placeholder={`Search ${title.toLowerCase()}`}
                value={query}
                onInput={(event) => setQuery(event.currentTarget.value)}
              />
            </label>
          </div>
        </section>

        {items.length === 0 ? (
          <div className="alert alert-info bg-base-100/90 backdrop-blur-sm">
            <EmptyIcon category={category} />
            <div>
              <h3 className="font-bold">{emptyTitle || `No ${title.toLowerCase()} found`}</h3>
              <div className="text-sm">
                {emptyDescription || `Add markdown files under src/data/${category}/ to populate this section.`}
              </div>
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="alert alert-warning bg-base-100/90 backdrop-blur-sm">
            <span>No results match "{query}".</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleItems.map((item) => (
              <WikiListCard
                key={item.id}
                item={item}
                category={category}
                routeBase={routeBase}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
