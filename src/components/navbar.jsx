import { useState, useEffect, useRef, useMemo } from "preact/hooks";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  VolumeDropdown,
  volumes,
} from "./volumeSelector.jsx";
import { SectionDropdown, sections } from "./sectionDropdown.jsx";
import "../index.css";

export default function Navbar({ onVolumeChange, selectedVolume }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentQuery = useMemo(() => {
    if (location.pathname !== "/search") return "";
    return new URLSearchParams(location.search).get("q") || "";
  }, [location.pathname, location.search]);

  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current && searchInputRef.current.value !== currentQuery) {
      searchInputRef.current.value = currentQuery;
    }
  }, [currentQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchInputRef.current?.value.trim() || "";
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };
  const [selectedSection, setSelectedSection] = useState(sections[0].label);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVolumeDropdownOpen, setIsVolumeDropdownOpen] = useState(false);

  const handleVolumeChange = (index) => {
    if (onVolumeChange) onVolumeChange(index);
  };
    const handleSectionChange = (section) => { 
    setSelectedSection(section);
  };

  return (
    <div className="sticky flex top-4 left-4 right-4 max-w-[calc(100vw-2rem)] h-1 navbar bg-secondary-200 border border-accent shadow-2xl rounded-xl px-4 z-50 backdrop-blur-md bg-opacity-70 overflow-visible">
      <div className="navbar-start">
        <button onClick={() => setIsDropdownOpen(true)} className="btn btn-ghost btn-circle" aria-label="Open Sections Menu">
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
        <div className="flex items-center gap-2">
          <Link to="/" className="btn btn-ghost text-xl">LOTM Wiki</Link>
          <button
            onClick={() => setIsVolumeDropdownOpen(true)}
            className="btn btn-xs sm:btn-sm btn-accent rounded-full gap-1 normal-case shadow-sm"
          >
            {volumes[selectedVolume]}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
       <div className="navbar-end">
         <form onSubmit={handleSearchSubmit} className="flex gap-2">
           <input
             type="search"
             aria-label="Search Wiki"
             placeholder="Search..."
             className="input input-bordered w-24 md:w-auto"
             ref={searchInputRef}
             defaultValue={currentQuery}
           />
         </form>
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
