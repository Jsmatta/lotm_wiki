import { useCallback, useMemo } from "preact/hooks";
import { Link, useParams } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { useAsyncData } from "../utils/useAsyncData.js";
import { getCategoryItem } from "../utils/wikiContent.js";
import { getWikiReferences } from "../utils/wikiReferences.js";
import { getExternalReferences } from "../utils/externalReferences.js";
import { MarkdownRenderer } from "../utils/MarkdownRenderer.jsx";
import { getCategory } from "../config/categories.js";
import { ICON_PATHS } from "../config/icons.js";
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
        <main className="container mx-auto px-3 sm:px-6">
          <div className="bg-base-200 border-2 border-base-content brutal-shadow p-8 font-mono">
            <h2 className="text-xl font-black uppercase text-error">[!] RECORD NOT FOUND</h2>
            <p className="text-sm text-base-content/70 mt-2">
              The requested {config.singular.toLowerCase()} dossier could not be located in archive volume {selectedVolume}.
            </p>
            <Link to={config.route} className="btn btn-sm btn-primary rounded-none border-2 border-black font-mono font-bold uppercase tracking-wider mt-6 brutal-shadow-xs brutal-btn">
              ← Return to {config.title}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-3 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={config.route}
            className="btn btn-sm rounded-none border-2 border-base-content bg-base-200 font-mono text-xs font-bold uppercase tracking-wide brutal-shadow-xs brutal-btn"
          >
            ← BACK TO {config.title}
          </Link>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-base-content/60 hidden sm:inline-block">
            SECURITY LEVEL: VOLUME {selectedVolume}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Article Dossier */}
          <div className="flex-1 order-2 lg:order-1 w-full">
            <article className="bg-base-200 border-2 border-base-content brutal-shadow-lg p-6 sm:p-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-primary border border-black"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  [ CLASSIFIED DOSSIER RECORD // {item.label.toUpperCase()} ]
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-mono uppercase tracking-tight text-base-content border-b-2 border-base-content/30 pb-4 mb-8">
                {item.name}
              </h1>

              <MarkdownRenderer
                content={item.content}
                references={references}
                currentPath={currentPath}
              />
            </article>
          </div>

          {/* Sidebar Dossier Sheet */}
          <aside className="w-full lg:w-80 shrink-0 order-1 lg:order-2">
            <div className="bg-base-200 border-2 border-base-content brutal-shadow-lg overflow-hidden">
              <div className="bg-base-300 border-b-2 border-base-content p-3 text-center">
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-base-content/70">
                  // PROFILE SHEET
                </div>
                <h2 className="font-mono font-black text-lg uppercase tracking-tight text-base-content mt-0.5">
                  {item.name}
                </h2>
              </div>

              <div className="p-3 bg-base-100 border-b-2 border-base-content">
                <div className="border-2 border-base-content overflow-hidden bg-base-300">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block"
                    />
                  ) : (
                    <div className="w-full aspect-square flex flex-col items-center justify-center p-4">
                      <Icon path={config.icon} className="h-16 w-16 text-base-content/20 mb-2" />
                      <span className="font-mono text-xs font-bold uppercase text-base-content/40">
                        [NO IMAGE RECORD]
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-4 font-mono text-xs">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b-2 border-base-content/10">
                      <th className="py-2 pr-2 text-left font-bold uppercase text-base-content/60 w-2/5">
                        CATEGORY:
                      </th>
                      <td className="py-2 text-left font-bold text-primary uppercase">
                        {item.label}
                      </td>
                    </tr>
                    <tr className="border-b-2 border-base-content/10">
                      <th className="py-2 pr-2 text-left font-bold uppercase text-base-content/60">
                        INTRODUCED:
                      </th>
                      <td className="py-2 text-left font-bold text-accent uppercase">
                        VOLUME {item.introducedInVolume}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2 pr-2 text-left font-bold uppercase text-base-content/60">
                        CLEARANCE:
                      </th>
                      <td className="py-2 text-left font-bold text-success uppercase">
                        AUTHORIZED
                      </td>
                    </tr>
                  </tbody>
                </table>

                {externalReferences.length > 0 && (
                  <div className="pt-3 border-t-2 border-base-content/20 space-y-2">
                    <div className="font-bold text-[10px] text-base-content/60 uppercase tracking-wider">
                      EXTERNAL ARCHIVES:
                    </div>
                    <div className="grid gap-2">
                      {externalReferences.map((reference) => (
                        <a
                          key={reference.href}
                          href={reference.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs rounded-none border-2 border-base-content font-mono font-bold uppercase tracking-wider bg-base-100 brutal-shadow-xs brutal-btn flex items-center justify-between"
                        >
                          <span>{reference.label}</span>
                          <Icon path={ICON_PATHS.externalLink} className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
