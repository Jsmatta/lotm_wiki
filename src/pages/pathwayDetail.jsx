import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { parseMarkdownForReact } from "../utils/frontmatter.js";
import { getPathwayImages } from "../utils/imageLoader.js";
import { MarkdownRenderer } from "../utils/MarkdownRenderer.jsx";
import { getCategoryFiles } from "../utils/markdownLoader.js";

export default function PathwayDetail({ selectedVolume }) {
  const { id } = useParams();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPathway = async () => {
      try {
        // Load pathway data dynamically
        const pathwayFiles = await getCategoryFiles("pathways");
        const files = Object.values(pathwayFiles).map((file) => file.content);
        
        const pathwayIndex = parseInt(id);
        
        if (pathwayIndex < files.length) {
          const file = files[pathwayIndex];
          const parsed = parseMarkdownForReact(file, selectedVolume);
          const imageMap = await getPathwayImages();
          
          const pathwayFileName = parsed.name
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");
          
          setPathway({
            id: pathwayIndex,
            name: parsed.name,
            introducedInVolume: parsed.introducedInVolume,
            category: parsed.category,
            content: parsed.content,
            image: imageMap[pathwayFileName] || imageMap[Object.keys(imageMap)[0]]
          });
        }
      } catch (error) {
        console.error("Error loading pathway:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPathway();
  }, [id, selectedVolume]);

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

  if (!pathway) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pathway not found</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/pathways" className="btn btn-ghost btn-sm">
            ← Back to Pathways
          </Link>
        </div>

        <div className="bg-base-100/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="hero lg:hero-side-lg">
            <div className="hero-content flex-col lg:flex-row gap-8 p-8">
              <div className="w-64 h-64 rounded-lg overflow-hidden border-4 border-accent bg-base-200">
                {pathway.image ? (
                  <img
                    src={pathway.image}
                    alt={pathway.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-base-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-base-300 text-base font-medium">{pathway.name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl lg:text-5xl font-bold border border-accent rounded-lg p-2">{pathway.name}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-100/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary/30 pb-3">Pathway Information</h2>
          <MarkdownRenderer content={pathway.content} />
        </div>
      </main>
    </div>
  );
}