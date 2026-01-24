import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { parseMarkdown } from "../utils/markdown.js";
import { getCharacterImages } from "../utils/characterImages.js";

export default function CharacterDetail({ selectedVolume }) {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Import character markdown file based on id
    const characterFiles = [
      () => import("../data/characters/klein_morreti.md?raw"),
      // Add more character files as needed
    ];

    const characterIndex = parseInt(id);
    
    if (characterIndex < characterFiles.length) {
      characterFiles[characterIndex]()
        .then(file => {
          const parsed = parseMarkdown(file.default, selectedVolume);
          
          // Load character images dynamically
          getCharacterImages().then(imageMap => {
            // Get character name from parsed data to match with image filenames
            const characterFileName = parsed.name
              .toLowerCase()
              .replace(/\s+/g, '_')  // Replace spaces with underscores
              .replace(/[^a-z0-9_]/g, ''); // Remove special characters
              
            setCharacter({
              id: characterIndex,
              name: parsed.name,
              introducedInVolume: parsed.introducedInVolume,
              category: parsed.category,
              htmlContent: parsed.htmlContent,
              image: imageMap[characterFileName] || imageMap[Object.keys(imageMap)[0]] // Fallback to first available image
            });
            setLoading(false);
          });
        })
        .catch(error => {
          console.error("Error loading character:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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

  if (!character) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Character not found</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/lotm_wiki/characters" className="btn btn-ghost btn-sm">
            ← Back to Characters
          </Link>
        </div>

        {/* Character Header with Image */}
        <div className="bg-base-100/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="hero lg:hero-side-lg">
            <div className="hero-content flex-col lg:flex-row gap-8 p-8">
              <div className="w-64 h-64 rounded-lg overflow-hidden border-4 border-accent bg-base-200">
                {character.image ? (
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover"
                   />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-base-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-base-300 text-base font-medium">{character.name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl lg:text-5xl font-bold">{character.name}</h1>
                </div>
                <div className="prose prose-lg max-w-none text-base-content/80">
                  <p className="text-lg">Detailed information about {character.name} will be displayed here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Character Content */}
        <div className="bg-base-100/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Character Information</h2>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: character.htmlContent }}
          />
        </div>
      </main>
    </div>
  );
}