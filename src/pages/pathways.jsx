import React, { useState, useEffect } from "react";
import { useVolumeSelector } from "../components/volumeSelector.jsx";
import { filterByVolume, parseMarkdown } from "../utils/markdown.js";

export default function Pathways() {
  const { selectedVolume } = useVolumeSelector();
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Import all pathway markdown files
    const pathwayModules = [
      () => import("../data/pathways/seer.md?raw"),
      // Add more pathway files as needed
    ];

    Promise.all(pathwayModules.map(module => module()))
      .then(files => {
        const pathwayData = files.map((file, index) => {
          const parsed = parseMarkdown(file.default, selectedVolume);
          return {
            id: index,
            name: parsed.name,
            introducedInVolume: parsed.introducedInVolume,
            category: parsed.category,
            htmlContent: parsed.htmlContent
          };
        });
        
        const filteredPathways = filterByVolume(pathwayData, selectedVolume);
        setPathways(filteredPathways);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading pathways:", error);
        setLoading(false);
      });
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
          <h1 className="text-4xl font-bold">Pathways</h1>
        </div>
        
        {pathways.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">No pathways found</h3>
              <div className="text-xs">No pathways are available for the selected volume.</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pathways.map(pathway => (
              <div key={pathway.id} className="card bg-base-100/90 backdrop-blur-sm shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{pathway.name}</h2>
                  <div className="badge badge-outline">Volume {pathway.introducedInVolume}</div>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: pathway.htmlContent }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}