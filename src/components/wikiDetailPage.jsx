import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { parseMarkdownForReact } from "../utils/frontmatter.js";
import { getCategoryFiles } from "../utils/markdownLoader.js";
import { getImages } from "../utils/imageLoader.js";
import { MarkdownRenderer } from "../utils/MarkdownRenderer.jsx";

function slugFromName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export default function WikiDetailPage({
  selectedVolume,
  category,
  title,
  routeBase,
  singularTitle,
  imageCategory = category,
  fallbackIconPath,
}) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);

      try {
        const categoryFiles = await getCategoryFiles(category);
        const file = categoryFiles[id];

        if (!file) {
          setItem(null);
          return;
        }

        const parsed = parseMarkdownForReact(file.content, selectedVolume);
        
        // Spoiler check: if the item's volume exceeds the selected volume, act as if not found
        if (parsed.introducedInVolume !== undefined && parsed.introducedInVolume > selectedVolume) {
          setItem(null);
          return;
        }

        const imageMap = await getImages(imageCategory);
        const imageKey = slugFromName(parsed.name || "");

        setItem({
          id: id,
          name: parsed.name || "Untitled",
          introducedInVolume: parsed.introducedInVolume ?? 0,
          category: parsed.category || category,
          content: parsed.content || "",
          image:
            imageMap[imageKey]
            || (imageKey === "klein_moretti" ? imageMap.klein_morreti : null)
            || null,
        });
      } catch (error) {
        console.error(`Error loading ${category} detail:`, error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [category, imageCategory, id, selectedVolume]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </main>
      </div>
    );
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
          {/* Main Content Column */}
          <div className="flex-1 order-2 lg:order-1 w-full">
            <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-8 shadow-xl border-4 border-primary">
              <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-primary border-b-2 border-primary/30 pb-3">
                {item.name}
              </h1>
              <MarkdownRenderer content={item.content} />
            </section>
          </div>

          {/* Sidebar / Infobox Column */}
          <aside className="w-full lg:w-80 shrink-0 order-1 lg:order-2">
            <div className="bg-info/10 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border-4 border-accent">
              {/* Infobox Image */}
              <div className="p-1 bg-base-200">
                <div className="rounded-md overflow-hidden bg-base-300">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
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

              {/* Infobox Details */}
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
                      <th className="bg-base-200/50 text-xs uppercase opacity-70">Introduction</th>
                      <td className="text-sm">Volume {item.introducedInVolume}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
