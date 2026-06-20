import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { parseMarkdownForReact, filterByVolume } from "../utils/frontmatter.js";
import { getCategoryFiles } from "../utils/markdownLoader.js";
import { getImages } from "../utils/imageLoader.js";

const iconPaths = {
  characters: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  pathways: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  places: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
  gods: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.365 2.444a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.444a1 1 0 00-1.176 0l-3.365 2.444c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L4.06 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.957z",
  organizations: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  spells: "M13 10V3L4 14h7v7l9-11h-7z",
  sealed_artifacts: "M12 11c0-1.105-.895-2-2-2S8 9.895 8 11s.895 2 2 2 2-.895 2-2zm0 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm-2 0H5m14 0h-5",
};

const categoryLabels = {
  characters: "Characters",
  pathways: "Pathways",
  places: "Places",
  gods: "Gods",
  organizations: "Organizations",
  spells: "Spells",
  sealed_artifacts: "Sealed Artifacts",
};

const categoryRoutes = {
  characters: "/characters",
  pathways: "/pathways",
  places: "/places",
  gods: "/gods",
  organizations: "/organizations",
  spells: "/spells",
  sealed_artifacts: "/sealed-artifacts",
};

function slugFromName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, query }) {
  if (!query) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-warning text-warning-content rounded px-0.5 font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

function CategoryIcon({ category, className = "h-5 w-5" }) {
  const path = iconPaths[category] || iconPaths.pathways;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
    </svg>
  );
}

function getMatchSnippet(content, query) {
  if (!content || !query) return "";
  const index = content.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return content.slice(0, 150) + (content.length > 150 ? "..." : "");
  }

  const start = Math.max(0, index - 60);
  const end = Math.min(content.length, index + query.length + 80);
  let snippet = content.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";
  return snippet;
}

export default function Search({ selectedVolume }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const loadAllCategories = async () => {
      setLoading(true);
      try {
        const imageMap = await getImages();
        const categories = Object.keys(categoryRoutes);
        
        const loadPromises = categories.map(async (category) => {
          try {
            const files = await getCategoryFiles(category);
            return Object.entries(files).map(([slug, file]) => {
              const parsed = parseMarkdownForReact(file.content, selectedVolume);
              const imageKey = slugFromName(parsed.name || "");
              
              // Resolve image
              const imageCategory = category === "sealed_artifacts" ? "sealed_artifacts" : category;
              const img =
                imageMap[imageCategory]?.[imageKey] ||
                (imageCategory === "characters" && imageKey === "klein_moretti"
                  ? imageMap.characters?.klein_morreti
                  : null) ||
                null;

              return {
                id: slug,
                name: parsed.name || "Untitled",
                introducedInVolume: parsed.introducedInVolume ?? 1,
                category: category,
                content: parsed.content || "",
                image: img,
              };
            });
          } catch (err) {
            console.error(`Failed to load category ${category}:`, err);
            return [];
          }
        });

        const results = await Promise.all(loadPromises);
        const combined = results.flat();
        
        // Filter out items introduced after the selected volume (respect spoilers)
        const visibleCombined = filterByVolume(combined, selectedVolume);
        setAllItems(visibleCombined);
      } catch (error) {
        console.error("Error fetching all categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllCategories();
  }, [selectedVolume]);

  const matchedItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return allItems.filter((item) =>
      `${item.name} ${categoryLabels[item.category]} ${item.content}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [allItems, query]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return matchedItems;
    return matchedItems.filter((item) => item.category === activeFilter);
  }, [matchedItems, activeFilter]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: matchedItems.length };
    Object.keys(categoryLabels).forEach((cat) => {
      counts[cat] = 0;
    });
    matchedItems.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });
    return counts;
  }, [matchedItems]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-6 shadow-xl mb-8">
          <h1 className="text-4xl font-bold">Search Results</h1>
          <p className="mt-3 text-base-content/80">
            {query.trim() ? (
              <span>
                Showing results for <span className="font-semibold text-primary">"{query}"</span>
              </span>
            ) : (
              "Please enter a query in the search box above to begin searching."
            )}
          </p>
          <div className="stats stats-horizontal bg-base-200/70 mt-5 shadow-sm">
            <div className="stat py-3">
              <div className="stat-title">Total Found</div>
              <div className="stat-value text-2xl">{matchedItems.length}</div>
            </div>
            <div className="stat py-3">
              <div className="stat-title">Volume Filter</div>
              <div className="stat-value text-2xl">{selectedVolume}</div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : query.trim() === "" ? (
          <div className="alert alert-info bg-base-100/90 backdrop-blur-sm">
            <div>
              <h3 className="font-bold">No query provided</h3>
              <div className="text-sm">Type something in the search bar above to see results.</div>
            </div>
          </div>
        ) : matchedItems.length === 0 ? (
          <div className="alert alert-warning bg-base-100/90 backdrop-blur-sm">
            <div>
              <h3 className="font-bold">No results found</h3>
              <div className="text-sm">
                No matching pages found for "{query}" that are safe for Volume {selectedVolume}.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="bg-base-100/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-accent/20">
                <h2 className="font-bold text-lg mb-4 text-secondary-content">Filter by Category</h2>
                <ul className="menu menu-vertical bg-base-100 rounded-box gap-1 p-0">
                  <li>
                    <button
                      onClick={() => setActiveFilter("all")}
                      className={`justify-between flex w-full ${activeFilter === "all" ? "active btn-primary" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                        All Categories
                      </span>
                      <span className="badge badge-sm badge-outline">{categoryCounts.all}</span>
                    </button>
                  </li>
                  {Object.entries(categoryLabels).map(([catId, label]) => (
                    <li key={catId}>
                      <button
                        onClick={() => setActiveFilter(catId)}
                        className={`justify-between flex w-full ${activeFilter === catId ? "active btn-primary" : ""}`}
                        disabled={categoryCounts[catId] === 0}
                      >
                        <span className="flex items-center gap-2">
                          <CategoryIcon category={catId} />
                          {label}
                        </span>
                        <span className="badge badge-sm badge-outline">{categoryCounts[catId]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Results Panel */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {filteredItems.length === 0 ? (
                <div className="alert alert-info bg-base-100/90 backdrop-blur-sm">
                  <span>No matches in the selected category.</span>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <Link
                    key={`${item.category}-${item.id}`}
                    to={`${categoryRoutes[item.category]}/${item.id}`}
                    className="flex flex-col sm:flex-row bg-base-100/95 hover:bg-base-100 hover:shadow-xl transition-all duration-300 border border-accent/30 hover:border-accent rounded-lg overflow-hidden group shadow-md"
                  >
                    {/* Thumbnail */}
                    <div className="w-full sm:w-36 h-36 shrink-0 bg-base-200 overflow-hidden relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-base-content/30">
                          <CategoryIcon category={item.category} className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    {/* Content Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h2 className="text-xl font-bold group-hover:text-accent transition-colors">
                            <HighlightedText text={item.name} query={query} />
                          </h2>
                          <div className="flex gap-2">
                            <span className="badge badge-secondary text-xs">
                              {categoryLabels[item.category]}
                            </span>
                            <span className="badge badge-outline text-xs">
                              V{item.introducedInVolume}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-base-content/85 line-clamp-3">
                          <HighlightedText text={getMatchSnippet(item.content, query)} query={query} />
                        </p>
                      </div>
                      <div className="text-xs text-accent mt-3 self-end font-semibold flex items-center gap-1 group-hover:underline">
                        Read Entry
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
