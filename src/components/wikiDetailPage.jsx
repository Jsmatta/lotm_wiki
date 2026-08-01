import { useCallback, useMemo } from "preact/hooks";
import { Link, useParams } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { useAsyncData } from "../utils/useAsyncData.js";
import { getCategoryItem } from "../utils/wikiContent.js";
import { getWikiReferences } from "../utils/wikiReferences.js";
import { getExternalReferences } from "../utils/externalReferences.js";
import { MarkdownRenderer } from "../utils/MarkdownRenderer.jsx";
import { getCategory } from "../config/categories.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import Icon from "./icon.jsx";
import LoadingPage from "./loadingPage.jsx";
import NotFoundPage from "../pages/notFound.jsx";

const EMPTY_RESULT = { item: null, references: [] };

/**
 * Single-entry view shared by every content category, routed as
 * `/:category/:id` where `id` is the markdown filename.
 */
export default function WikiDetailPage({ category }) {
  const config = getCategory(category);
  const selectedVolume = useSelectedVolume();
  const { id } = useParams();
  const currentPath = config ? `${config.route}/${id}` : null;

  const load = useCallback(async () => {
    const [item, references] = await Promise.all([
      getCategoryItem(category, id, selectedVolume),
      getWikiReferences(selectedVolume),
    ]);

    return item ? { item, references } : EMPTY_RESULT;
  }, [category, id, selectedVolume]);

  const { data, loading } = useAsyncData(
    load,
    [category, id, selectedVolume],
    EMPTY_RESULT,
  );
  const { item, references } = data;

  const externalReferences = useMemo(
    () => (item ? getExternalReferences(item.name) : []),
    [item],
  );

  usePageTitle(item ? item.name : config?.singular);

  if (!config) {
    return <NotFoundPage />;
  }

  if (loading) {
    return <LoadingPage message={`Opening ${config.singular.toLowerCase()} record…`} />;
  }

  if (!item) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="alert alert-error bg-base-100/90 backdrop-blur-sm">
            <span>{config.singular} not found</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={config.route} className="btn btn-ghost btn-sm">
            Back to {config.title}
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 order-2 lg:order-1 w-full">
            <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-8 shadow-xl border-4 border-primary">
              <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-primary border-b-2 border-primary/30 pb-3">
                {item.name}
              </h1>
              <MarkdownRenderer
                content={item.content}
                references={references}
                currentPath={currentPath}
              />
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
                      <Icon path={config.icon} className="h-20 w-20 text-base-content/20" />
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
                      <td className="text-sm capitalize">{item.label}</td>
                    </tr>
                    <tr>
                      <th className="bg-base-200/50 text-xs uppercase opacity-70">Introduced In</th>
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
