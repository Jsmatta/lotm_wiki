import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { parseMarkdownForReact, filterByVolume } from "../utils/frontmatter.js";
import { getCategoryFiles } from "../utils/markdownLoader.js";
import { getImages } from "../utils/imageLoader.js";
import { CompactMarkdown } from "../utils/MarkdownRenderer.jsx";
import LoadingPage from "./loadingPage.jsx";

const iconPaths = {
  characters: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  pathways: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  places: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
  gods: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.365 2.444a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.444a1 1 0 00-1.176 0l-3.365 2.444c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L4.06 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.957z",
  organizations: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  spells: "M13 10V3L4 14h7v7l9-11h-7z",
  sealed_artifacts: "M12 11c0-1.105-.895-2-2-2S8 9.895 8 11s.895 2 2 2 2-.895 2-2zm0 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm-2 0H5m14 0h-5",
};

function slugFromName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

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
        d={iconPaths[category] || iconPaths.pathways}
      />
    </svg>
  );
}

export default function WikiListPage({
  selectedVolume,
  category,
  title,
  description,
  routeBase,
  imageCategory = category,
  emptyTitle,
  emptyDescription,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  usePageTitle(title);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const categoryFiles = await getCategoryFiles(category);
        const imageMap = await getImages(imageCategory);

        const itemData = Object.entries(categoryFiles).map(([slug, file]) => {
          const parsed = parseMarkdownForReact(file.content, selectedVolume);
          const imageKey = slugFromName(parsed.name || "");

          return {
            id: slug,
            name: parsed.name || "Untitled",
            introducedInVolume: parsed.introducedInVolume ?? 0,
            category: parsed.category || category,
            content: parsed.content || "",
            image:
              imageMap[imageKey]
              || (imageKey === "klein_moretti" ? imageMap.klein_morreti : null)
              || null,
          };
        });

        setItems(filterByVolume(itemData, selectedVolume));
      } catch (error) {
        console.error(`Error loading ${category}:`, error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category, imageCategory, selectedVolume]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      `${item.name} ${item.category} ${item.content}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [items, query]);

  if (loading) {
    return <LoadingPage />;
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
              <Link
                key={item.id}
                to={`${routeBase}/${item.id}`}
                className="card bg-base-100/95 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-accent/50 hover:border-accent group"
              >
                <figure className="h-48 overflow-hidden bg-base-200">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
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
                  {item.content && (
                    <div className="line-clamp-4 text-sm text-base-content/80">
                      <CompactMarkdown content={item.content} className="max-w-none" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
