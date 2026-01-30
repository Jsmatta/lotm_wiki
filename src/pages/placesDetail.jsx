import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { parseMarkdownForReact } from "../utils/frontmatter.js";
import { getPlaceImages } from "../utils/imageLoader.js";
import { MarkdownRenderer } from "../utils/MarkdownRenderer.jsx";
import { getCategoryFiles } from "../utils/markdownLoader.js";

export default function PlacesDetail({ selectedVolume }) {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlace = async () => {
      try {
        // Load place data dynamically
        const placeFiles = await getCategoryFiles("places");
        const files = Object.values(placeFiles).map((file) => file.content);
        
        const placeIndex = parseInt(id);
        
        if (placeIndex < files.length) {
          const file = files[placeIndex];
          const parsed = parseMarkdownForReact(file, selectedVolume);
          const imageMap = await getPlaceImages();
          
          const placeFileName = parsed.name
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");
          
          setPlace({
            id: placeIndex,
            name: parsed.name,
            introducedInVolume: parsed.introducedInVolume,
            category: parsed.category,
            content: parsed.content,
            image: imageMap[placeFileName] || imageMap[Object.keys(imageMap)[0]]
          });
        }
      } catch (error) {
        console.error("Error loading place:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
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

  if (!place) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Place not found</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/places" className="btn btn-ghost btn-sm">
            ← Back to Places
          </Link>
        </div>

        <div className="bg-base-100/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="hero lg:hero-side-lg">
            <div className="hero-content flex-col lg:flex-row gap-8 p-8">
              <div className="w-64 h-64 rounded-lg overflow-hidden border-4 border-accent bg-base-200">
                {place.image ? (
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-base-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-base-300 text-base font-medium">{place.name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl lg:text-5xl font-bold border border-accent rounded-lg p-2">{place.name}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-100/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-primary border-b-2 border-primary/30 pb-3">Place Information</h2>
          <MarkdownRenderer content={place.content} />
        </div>
      </main>
    </div>
  );
}