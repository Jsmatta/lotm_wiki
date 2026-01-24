import React, { useState } from "react";
import {
  useVolumeSelector,
  VolumeDropdown,
  volumes,
} from "./volumeSelector.jsx";
import { SectionDropdown, sections } from "./sectionDropdown.jsx";
import "../index.css";

export default function Navbar({ onVolumeChange }) {
  const { selectedVolume, setSelectedVolume } = useVolumeSelector();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleVolumeChange = (index) => {
    setSelectedVolume(index);
    if (onVolumeChange) onVolumeChange(index);
  };
    const handleSectionChange = (section) => { 
    setSelectedSection(section);
  };

  return (
    <div className="flex top-4 left-4 right-4 max-w-[calc(100vw-2rem)] h-1 navbar bg-secondary-200 border border-accent shadow-2xl rounded-xl px-4 z-50 backdrop-blur-md bg-opacity-70 overflow-visible">
      <div className="navbar-start">
        <VolumeDropdown
          selectedVolume={selectedVolume}
          onVolumeChange={handleVolumeChange}
        />
      </div>
      <div className="navbar-center">
        <div className="flex flex-col items-center">
          <button onClick={() => setIsDropdownOpen(true)} className="btn btn-ghost text-xl">LOTM Wiki</button>
          <span className="text-sm">{volumes[selectedVolume]}</span>
        </div>
      </div>
       <div className="navbar-end">
         <div className="flex gap-2">
           <input
             type="text"
             placeholder="Search"
             className="input input-bordered w-24 md:w-auto"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>
      <SectionDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        selectedSection={selectedSection}
        onSectionChange={handleSectionChange}
      />
    </div>
  );
}
