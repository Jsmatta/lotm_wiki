import React, { useState, useEffect } from "react";
import { useVolumeSelector } from "../components/volumeSelector";
import { parseMarkdownForReact, filterByVolume } from "../utils/frontmatter";
import { getCategoryFiles } from "../utils/markdownLoader";
import { MarkdownRenderer } from "../utils/MarkdownRenderer";

export default function Places() {
  const { selectedVolume } = useVolumeSelector();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load places data dynamically
        const placesFiles = await getCategoryFiles('places');
        const files = Object.values(placesFiles).map(file => file.content);
        
        const placesData = files.map((file, index) => {
          const parsed = parseMarkdownForReact(file, selectedVolume);
          return {
            id: index,
            name: parsed.name,
            introducedInVolume: parsed.introducedInVolume,
            category: parsed.category,
            content: parsed.content
          };
        });
        
        const filteredPlaces = filterByVolume(placesData, selectedVolume);
        setPlaces(filteredPlaces);
      } catch (error) {
        console.error("Error loading places:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedVolume]);

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

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-base-100/90 backdrop-blur-sm rounded-lg p-6 shadow-xl mb-8">
          <h1 className="text-4xl font-bold">Places</h1>
        </div>
        
        {places.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">No places found</h3>
              <div className="text-xs">No places are available for the selected volume.</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {places.map(place => (
              <div key={place.id} className="card bg-base-100/90 backdrop-blur-sm shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{place.name}</h2>
                  <div className="badge badge-outline">Volume {place.introducedInVolume}</div>
                  <MarkdownRenderer content={place.content} className="prose prose-sm max-w-none mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}