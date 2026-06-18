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
        const files = Object.values(categoryFiles).map((file) => file.content);
        const itemIndex = parseInt(id);

        if (Number.isNaN(itemIndex) || itemIndex < 0 || itemIndex >= files.length) {
          setItem(null);
          return;
        }

        const parsed = parseMarkdownForReact(files[itemIndex], selectedVolume);
        const imageMap = await getImages(imageCategory);
        const imageKey = slugFromName(parsed.name || "");

        setItem({
          id: itemIndex,
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

        <section className="bg-base-100/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="hero">
            <div className="hero-content flex-col lg:flex-row gap-8 p-8 w-full">
              <div className="w-64 h-64 rounded-lg overflow-hidden border-4 border-accent bg-base-200 shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center px-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 mx-auto text-base-content/30 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={fallbackIconPath} />
                      </svg>
                      <span className="text-base-content/50 text-base font-medium">
                        {item.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl lg:text-5xl font-bold break-words">
                  {item.name}
                </h1>
                <div className="flex flex-wrap gap-3 mt-5">
                  <div className="badge badge-primary">
                    Introduced Volume {item.introducedInVolume}
                  </div>
                  <div className="badge badge-secondary">{item.category}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary/30 pb-3">
            {singularTitle} Information
          </h2>
          <MarkdownRenderer content={item.content} />
        </section>
      </main>
    </div>
  );
}
