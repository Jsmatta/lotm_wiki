import React, { useState, useEffect } from "react";
import { useVolumeSelector } from "../components/volumeSelector.jsx";
import { filterByVolume, parseMarkdown } from "../utils/markdown.js";
import { getCategoryFiles } from "../utils/markdownLoader.js";

export default function Pathways() {
  const { selectedVolume } = useVolumeSelector();
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load pathway data dynamically
        const pathwayFiles = await getCategoryFiles('pathways');
        const files = Object.values(pathwayFiles).map(file => file.content);
        
        const pathwayData = files.map((file, index) => {
          const parsed = parseMarkdown(file, selectedVolume);
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
      } catch (error) {
        console.error("Error loading pathways:", error);
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
                    className="prose prose-sm max-w-none mt-4 [&_h1]:text-3xl [&_h1]:lg:text-4xl [&_h1]:mt-10 [&_h1]:mb-6 [&_h1]:text-primary [&_h1]:border-b-2 [&_h1]:border-base-300 [&_h1]:pb-2 [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h2]:mt-8 [&_h2]:mb-5 [&_h2]:text-secondary [&_h2]:border-b-2 [&_h2]:border-base-300 [&_h2]:pb-2 [&_h3]:text-xl [&_h3]:lg:text-2xl [&_h3]:mt-6 [&_h3]:mb-4 [&_h3]:text-accent [&_h3]:border-b-2 [&_h3]:border-base-300 [&_h3]:pb-2 [&_ul]:space-y-2 [&_ul]:my-6 [&_li]:border-l-4 [&_li]:border-accent/30 [&_li]:hover:border-accent/60 [&_li]:transition-colors [&_li]:duration-200 [&_li]:bg-base-100/30 [&_li]:rounded-r [&_li]:p-3 [&_li]:-ml-2"
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