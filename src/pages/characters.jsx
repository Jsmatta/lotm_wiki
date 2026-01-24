import React, { useState, useEffect } from "react";
import { useVolumeSelector } from "../components/volumeSelector.jsx";
import { filterByVolume, parseMarkdown } from "../utils/markdown.js";

export default function Characters() {
  const { selectedVolume } = useVolumeSelector();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Import all character markdown files
    const characterModules = [
      () => import("../data/characters/klein_morreti.md?raw"),
      // Add more character files as needed
    ];

    Promise.all(characterModules.map(module => module()))
      .then(files => {
        const characterData = files.map((file, index) => {
          const parsed = parseMarkdown(file.default, selectedVolume);
          return {
            id: index,
            name: parsed.name,
            introducedInVolume: parsed.introducedInVolume,
            category: parsed.category,
            htmlContent: parsed.htmlContent
          };
        });
        
        const filteredCharacters = filterByVolume(characterData, selectedVolume);
        setCharacters(filteredCharacters);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading characters:", error);
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
        <h1 className="text-4xl font-bold mb-8">Characters</h1>
        
        {characters.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">No characters found</h3>
              <div className="text-xs">No characters are available for the selected volume.</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
              <div key={character.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    <a href={`/lotm_wiki/characters/${character.id}`} className="link link-primary">
                      {character.name}
                    </a>
                  </h2>
                  <div className="badge badge-outline">Volume {character.introducedInVolume}</div>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: character.htmlContent }}
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