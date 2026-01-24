import React, { useState } from "react";
import Navbar from "../components/navbar.jsx";
import logoImg from "../assets/lotm_logo.webp"; // Import the image
import { SectionDropdown, sections } from "../components/sectionDropdown.jsx";

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSectionChange = (section) => {
    setSelectedSection(section);  };

  return (
    <div className="bg-base-300 min-h-screen">
      <Navbar />
      <main className="w-full">
        <div className="hero min-h-screen flex flex-col justify-center px-4">
          <div className="hero-content text-center border border-primary rounded-lg p-4 md:p-8 flex-col lg:flex-row-reverse gap-6 lg:gap-12 bg-base-100 shadow-lg">
             <img
               src={logoImg}
               className="w-full max-w-sm rounded-lg shadow-2xl border-4 border-primary"
             />
             <div className="w-full max-w-3xl">
               <h1 className="text-4xl md:text-5xl font-bold">LOTM Wiki</h1>
               <p className="py-5  w-full">
                 Welcome to the LOTM Wiki! Your ultimate resource for everything
                 related to the Lord of the Mysteries series. Dive into detailed
                 character bios, volume summaries, and lore explanations to
                 enhance your reading experience and filter out content you
                 haven't reached yet.
               </p>
               <button onClick={() => setIsDropdownOpen(true)} className="btn btn-primary normal-case text-base">
                 Select Section
               </button>
               <SectionDropdown
                 isOpen={isDropdownOpen}
                 onClose={() => setIsDropdownOpen(false)}
                 selectedSection={selectedSection}
                 onSectionChange={handleSectionChange}
               />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
