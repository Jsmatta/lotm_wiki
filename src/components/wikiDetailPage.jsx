import { useEffect, useState } from "preact/hooks";
import { Link, useParams } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { getCategoryItem } from "../utils/wikiContent.js";
import { getWikiReferences } from "../utils/wikiReferences.js";
import { getExternalReferences } from "../utils/externalReferences.js";
import { MarkdownRenderer } from "../utils/MarkdownRenderer.jsx";
import LoadingPage from "./loadingPage.jsx";

export default function WikiDetailPage({
  selectedVolume,
  category,
  title,
  routeBase,
  singularTitle,
  introductionLabel = "Introduction",
  imageCategory = category,
  fallbackIconPath,
}) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [references, setReferences] = useState([]);
  const [externalReferences, setExternalReferences] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageTitle(item ? item.name : singularTitle);

  useEffect(() => {
    let cancelled = false;

    const loadItem = async () => {
      setLoading(true);

      try {
        const currentPath = `${routeBase}/${id}`;
        const [loadedItem, wikiReferences] = await Promise.all([
          getCategoryItem(category, id, selectedVolume, imageCategory),
          getWikiReferences(selectedVolume, currentPath),
        ]);

        if (cancelled) return;

        if (!loadedItem) {
          setItem(null);
          setReferences([]);
          setExternalReferences([]);
          return;
        }

        setReferences(wikiReferences);
        setExternalReferences(getExternalReferences(loadedItem.name));
        setItem(loadedItem);
      } catch (error) {
        console.error(`Error loading ${category} detail:`, error);
        if (!cancelled) {
          setItem(null);
          setReferences([]);
          setExternalReferences([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadItem();
    return () => { cancelled = true; };
  }, [category, imageCategory, id, routeBase, selectedVolume]);

  if (loading) {
    return <LoadingPage message={`Opening ${singularTitle.toLowerCase()} record…`} />;
  }

  if (!item) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="alert alert-error bg-base-100/90 backdrop-blur-sm">
            <span>{singularTitle} not found</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={routeBase} className="btn btn-ghost btn-sm">
            Back to {title}
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 order-2 lg:order-1 w-full">
            <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-8 shadow-xl border-4 border-primary">
              <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-primary border-b-2 border-primary/30 pb-3">
                {item.name}
              </h1>
              <MarkdownRenderer content={item.content} references={references} />
            </section>
          </div>

          <aside className="w-full lg:w-80 shrink-0 order-1 lg:order-2">
            <div className="bg-info/10 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border-4 border-accent">
              <div className="p-1 bg-base-200">
                <div className="rounded-md overflow-hidden bg-base-300">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block"
                    />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-base-content/20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={fallbackIconPath} />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-center font-bold text-xl mb-4 border-b border-base-300 pb-2">
                  {item.name}
                </h2>

                <table className="table table-compact w-full bg-transparent">
                  <tbody>
                    <tr>
                      <th className="bg-base-200/50 text-xs uppercase opacity-70 w-1/3">Category</th>
                      <td className="text-sm capitalize">{item.category}</td>
                    </tr>
                    <tr>
                      <th className="bg-base-200/50 text-xs uppercase opacity-70">{introductionLabel}</th>
                      <td className="text-sm">Volume {item.introducedInVolume}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="grid gap-2 mt-4 pt-4 border-t border-base-300">
                  {externalReferences.map((reference) => (
                    <a
                      key={reference.href}
                      href={reference.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm normal-case"
                    >
                      {reference.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
