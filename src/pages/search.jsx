import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { parseMarkdownForReact, filterByVolume } from "../utils/frontmatter.js";
import { getCategoryFiles } from "../utils/markdownLoader.js";
import { getImages } from "../utils/imageLoader.js";
import LoadingPage from "../components/loadingPage.jsx";

// ─── Constants ───────────────────────────────────────────────────────────────

const iconPaths = {
  characters:
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  pathways:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  places:
    "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
  gods:
    "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.365 2.444a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.444a1 1 0 00-1.176 0l-3.365 2.444c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L4.06 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.957z",
  organizations:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  spells: "M13 10V3L4 14h7v7l9-11h-7z",
  sealed_artifacts:
    "M12 11c0-1.105-.895-2-2-2S8 9.895 8 11s.895 2 2 2 2-.895 2-2zm0 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm-2 0H5m14 0h-5",
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

// ─── Pure helpers (defined outside component, never re-created) ──────────────

function slugFromName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Strip markdown syntax so snippets show clean prose */
function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")          // headings
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1") // bold / italic
    .replace(/`{1,3}[^`]*`{1,3}/g, "")    // inline code / fences
    .replace(/:::reveal[^]*?:::/g, "")     // spoiler blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/^\s*[-*>]\s+/gm, "")        // list markers / blockquotes
    .replace(/\n{2,}/g, " ")              // collapse newlines
    .trim();
}

function getMatchSnippet(plainText, query) {
  if (!plainText) return "";
  if (!query) return plainText.slice(0, 160) + (plainText.length > 160 ? "…" : "");

  const idx = plainText.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return plainText.slice(0, 160) + (plainText.length > 160 ? "…" : "");

  const start = Math.max(0, idx - 60);
  const end   = Math.min(plainText.length, idx + query.length + 80);
  let snippet = plainText.slice(start, end);
  if (start > 0) snippet = "…" + snippet;
  if (end < plainText.length) snippet += "…";
  return snippet;
}

// ─── Small memoised sub-components ───────────────────────────────────────────

const HighlightedText = memo(function HighlightedText({ text, query }) {
  if (!query || !text) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-warning/80 text-warning-content rounded-sm px-0.5 font-semibold not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
});

const CategoryIcon = memo(function CategoryIcon({ category, className = "h-5 w-5" }) {
  const d = iconPaths[category] ?? iconPaths.pathways;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
    </svg>
  );
});

/** Memoised result card – only re-renders when its own item or the query changes */
const ResultCard = memo(function ResultCard({ item, query }) {
  const snippet = useMemo(
    () => getMatchSnippet(item.plainText, query),
    [item.plainText, query]
  );

  return (
    <Link
      to={`${categoryRoutes[item.category]}/${item.id}`}
      className="flex flex-col sm:flex-row bg-base-100/95 hover:bg-base-100 hover:shadow-lg transition-shadow duration-150 border border-accent/30 hover:border-accent rounded-lg overflow-hidden group shadow-md"
    >
      {/* Thumbnail */}
      <div className="w-full sm:w-32 h-32 shrink-0 bg-base-200 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-base-content/20">
            <CategoryIcon category={item.category} className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h2 className="text-lg font-bold leading-tight group-hover:opacity-75 transition-opacity duration-100">
              <HighlightedText text={item.name} query={query} />
            </h2>
            <div className="flex gap-2 shrink-0">
              {item.nameMatch && (
                <span className="badge badge-primary badge-sm">Name match</span>
              )}
              <span className="badge badge-secondary badge-sm">
                {categoryLabels[item.category]}
              </span>
              <span className="badge badge-outline badge-sm">
                V{item.introducedInVolume}
              </span>
            </div>
          </div>
          <p className="text-sm text-base-content/75 line-clamp-2 leading-snug">
            <HighlightedText text={snippet} query={query} />
          </p>
        </div>

        <div className="text-xs text-accent mt-3 self-end font-semibold flex items-center gap-1 group-hover:underline">
          Read Entry
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────

export default function Search({ selectedVolume }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [allItems, setAllItems]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  
  usePageTitle(query ? `Search: ${query}` : "Search");

  // Reset category filter when query changes so stale filters don't hide results
  const prevQuery = React.useRef(query);
  if (prevQuery.current !== query) {
    prevQuery.current = query;
    if (activeFilter !== "all") setActiveFilter("all");
  }

  // Load all categories once (or when volume changes)
  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      setLoading(true);
      try {
        // getImages() MUST resolve first — category loaders reference imageMap in their closures
        const imageMap = await getImages();

        if (cancelled) return;

        const categoryEntries = await Promise.all(
          Object.keys(categoryRoutes).map(async (category) => {
            try {
              const files = await getCategoryFiles(category);
              return Object.entries(files).map(([slug, file]) => {
                const parsed   = parseMarkdownForReact(file.content, selectedVolume);
                const imageKey = slugFromName(parsed.name || "");

                const img =
                  imageMap[category]?.[imageKey] ||
                  (category === "characters" && imageKey === "klein_moretti"
                    ? imageMap.characters?.klein_morreti
                    : null) ||
                  null;

                // Pre-compute a clean plain-text blob for searching
                const plainText = stripMarkdown(parsed.content || "");

                return {
                  id:                 slug,
                  name:               parsed.name || "Untitled",
                  introducedInVolume: parsed.introducedInVolume ?? 1,
                  category,
                  plainText,
                  image: img,
                };
              });
            } catch {
              return [];
            }
          })
        );

        if (cancelled) return;

        const combined = categoryEntries.flat();
        setAllItems(filterByVolume(combined, selectedVolume));
      } catch (err) {
        console.error("Search: failed to load categories", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  }, [selectedVolume]);

  // Rank: name matches (score 2) > body matches (score 1), then sort by volume
  const matchedItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return allItems
      .map((item) => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const bodyMatch = item.plainText.toLowerCase().includes(q);
        if (!nameMatch && !bodyMatch) return null;
        return { ...item, nameMatch, score: nameMatch ? 2 : 1 };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.introducedInVolume - b.introducedInVolume);
  }, [allItems, query]);

  const filteredItems = useMemo(
    () => (activeFilter === "all" ? matchedItems : matchedItems.filter((i) => i.category === activeFilter)),
    [matchedItems, activeFilter]
  );

  const categoryCounts = useMemo(() => {
    const counts = { all: matchedItems.length };
    Object.keys(categoryLabels).forEach((c) => (counts[c] = 0));
    matchedItems.forEach((i) => { if (counts[i.category] !== undefined) counts[i.category]++; });
    return counts;
  }, [matchedItems]);

  const handleFilterClick = useCallback((id) => setActiveFilter(id), []);

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">

        {/* Header */}
        <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-6 shadow-xl mb-8">
          <h1 className="text-4xl font-bold">Search Results</h1>
          <p className="mt-2 text-base-content/80">
            {query.trim() ? (
              <>Showing results for <span className="font-semibold text-primary">"{query}"</span></>
            ) : (
              "Type a query in the search bar above to begin."
            )}
          </p>
          <div className="stats stats-horizontal bg-base-200/70 mt-5 shadow-sm">
            <div className="stat py-3">
              <div className="stat-title">Results</div>
              <div className="stat-value text-2xl">{loading ? "—" : matchedItems.length}</div>
            </div>
            <div className="stat py-3">
              <div className="stat-title">Volume filter</div>
              <div className="stat-value text-2xl">{selectedVolume}</div>
            </div>
          </div>
        </section>

        {/* Body */}
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-base-content/50 text-sm">Loading wiki index…</p>
          </div>
        ) : query.trim() === "" ? (
          <div className="alert alert-info bg-base-100/90 backdrop-blur-sm">
            <div>
              <h3 className="font-bold">No query provided</h3>
              <p className="text-sm">Type something in the search bar above.</p>
            </div>
          </div>
        ) : matchedItems.length === 0 ? (
          <div className="alert alert-warning bg-base-100/90 backdrop-blur-sm">
            <div>
              <h3 className="font-bold">No results for "{query}"</h3>
              <p className="text-sm">
                Nothing matched within your current volume filter (Volume {selectedVolume}).
                Try a different term or increase your volume setting.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sticky sidebar */}
            <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-24 self-start">
              <div className="bg-base-100/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-accent/20">
                <h2 className="font-bold text-base mb-3 uppercase tracking-wide text-base-content/60 text-xs">
                  Filter by Category
                </h2>
                <ul className="flex flex-col gap-0.5">
                  {[{ id: "all", label: "All Categories", icon: null }, ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label, icon: id }))].map(({ id, label, icon }) => {
                    const count   = categoryCounts[id] ?? 0;
                    const active  = activeFilter === id;
                    const isEmpty = id !== "all" && count === 0;
                    return (
                      <li key={id}>
                        <button
                          onClick={() => handleFilterClick(id)}
                          disabled={isEmpty}
                          className={[
                            "w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-primary text-primary-content font-semibold"
                              : isEmpty
                              ? "text-base-content/30 cursor-not-allowed"
                              : "hover:bg-base-200 text-base-content",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-2">
                            {icon ? (
                              <CategoryIcon category={icon} className="h-4 w-4 shrink-0" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                            )}
                            {label}
                          </span>
                          <span className={`badge badge-sm ${active ? "badge-primary-content border-primary-content" : "badge-outline"}`}>
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <p className="text-xs text-base-content/40 px-1">
                {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} — name matches shown first
              </p>
              {filteredItems.length === 0 ? (
                <div className="alert alert-info bg-base-100/90 backdrop-blur-sm">
                  <span>No matches in this category.</span>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <ResultCard key={`${item.category}-${item.id}`} item={item} query={query} />
                ))
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
