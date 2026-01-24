import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const [isVolumeDropdownOpen, setIsVolumeDropdownOpen] = useState(false);

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
        <button onClick={() => setIsDropdownOpen(true)} className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
      </div>
      <div className="navbar-center">
        <div className="flex flex-col items-center">
          <Link onClick={() => setIsVolumeDropdownOpen(true)} className="btn btn-ghost text-xl">LOTM Wiki</Link>
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
      <VolumeDropdown
        isOpen={isVolumeDropdownOpen}
        onClose={() => setIsVolumeDropdownOpen(false)}
        selectedVolume={selectedVolume}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}
