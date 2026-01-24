import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { parseMarkdown } from "../utils/markdown.js";
import { getCharacterImages } from "../utils/characterImages.js";
import { getCategoryFiles } from "../utils/markdownLoader.js";

export default function Characters({ selectedVolume }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load character data dynamically
        const characterFiles = await getCategoryFiles('characters');
        const files = Object.values(characterFiles).map(file => file.content);
        
        // Load images and create character data
        const imageMap = await getCharacterImages();
        
        const characterData = files.map((file, index) => {
          const parsed = parseMarkdown(file, selectedVolume);
          const characterFileName = parsed.name
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
            
          return {
            id: index,
            name: parsed.name,
            introducedInVolume: parsed.introducedInVolume,
            category: parsed.category,
            htmlContent: parsed.htmlContent,
            image: imageMap[characterFileName] || imageMap[Object.keys(imageMap)[0]]
          };
        });
        
        setCharacters(characterData);
      } catch (error) {
        console.error("Error loading characters:", error);
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
          <h1 className="text-4xl font-bold">Characters</h1>
        </div>
        
        {characters.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">No characters found</h3>
              <div className="text-xs">No characters are available for selected volume.</div>
            </div>
          </div>
        ) : (
          // Character grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map(character => (
              <Link key={character.id} to={`/lotm_wiki/characters/${character.id}`} className="block group">
                <div className="card bg-base-100 border-accent shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <figure className="h-48 overflow-hidden bg-base-200">
                    {character.image ? (
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-base-300 text-sm">No Image</span>
                        </div>
                      </div>
                    )}
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-lg group-hover:text-accent transition-colors">
                      {character.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}