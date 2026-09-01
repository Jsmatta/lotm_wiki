import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VolumeDropdown } from "./volumeSelector.jsx";
import { SectionDropdown } from "./sectionDropdown.jsx";
import CommandPalette from "./commandPalette.jsx";
import { volumeTitle } from "../config/volumes.js";
import { ICON_PATHS } from "../config/icons.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import Icon from "./icon.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedVolume = useSelectedVolume();
  const searchInputRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentQuery = useMemo(() => {
    if (location.pathname !== "/search") return "";
    return new URLSearchParams(location.search).get("q") || "";
  }, [location.pathname, location.search]);

  // The input is uncontrolled so typing never re-renders the navbar; sync it
  // only when the URL's query diverges (back/forward, or leaving /search).
  useEffect(() => {
    if (searchInputRef.current && searchInputRef.current.value !== currentQuery) {
      searchInputRef.current.value = currentQuery;
    }
  }, [currentQuery]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchInputRef.current?.value.trim() || "";

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      setIsCommandPaletteOpen(true);
    }
  };

  const closeDropdown = () => setOpenDropdown(null);

  return (
    <header className="sticky top-3 z-50 w-full px-3 sm:px-6 flex justify-center pointer-events-none">
      <div className="navbar bg-base-200 border-2 border-base-content brutal-shadow rounded-none px-3 sm:px-5 min-h-[3.75rem] flex items-center justify-between w-full max-w-7xl pointer-events-auto">
        <div className="navbar-start w-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenDropdown("sections")}
            className="btn btn-sm btn-square bg-base-100 border-2 border-base-content rounded-none brutal-shadow-xs brutal-btn hover:bg-primary hover:text-primary-content"
            aria-label="Open sections menu"
          >
            <Icon path={ICON_PATHS.menu} className="h-5 w-5" />
          </button>
          <Link
            to="/"
            className="btn btn-ghost rounded-none font-mono font-black text-base sm:text-lg tracking-wider uppercase px-2 hover:bg-base-300"
          >
            <span className="text-primary">LOTM</span>//WIKI
          </Link>
        </div>

        <div className="navbar-center hidden sm:flex items-center">
          <button
            type="button"
            onClick={() => setOpenDropdown("volumes")}
            className="btn btn-sm bg-accent text-accent-content border-2 border-black rounded-none font-mono font-bold text-xs uppercase tracking-wide gap-1.5 brutal-shadow-xs brutal-btn"
            aria-label="Change reading volume"
          >
            <span className="opacity-80">[VOL. {selectedVolume}]</span>
            <span>{volumeTitle(selectedVolume)}</span>
            <Icon path={ICON_PATHS.chevronDown} className="h-3.5 w-3.5 ml-0.5" />
          </button>
        </div>

        <div className="navbar-end w-auto flex items-center gap-2">
          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setOpenDropdown("volumes")}
              className="btn btn-xs bg-accent text-accent-content border-2 border-black rounded-none font-mono font-bold uppercase brutal-shadow-xs"
              aria-label="Change reading volume"
            >
              V{selectedVolume}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-base-100 border-2 border-base-content/80 hover:border-primary font-mono text-xs brutal-shadow-xs brutal-btn"
            aria-label="Open global search (Cmd+K)"
          >
            <Icon path={ICON_PATHS.search} className="h-3.5 w-3.5 text-primary" />
            <span className="hidden md:inline uppercase text-base-content/70">SEARCH ARCHIVES</span>
            <kbd className="hidden sm:inline-block bg-base-300 px-1.5 py-0.5 border border-base-content/30 text-[10px] font-bold">
              ⌘K
            </kbd>
          </button>
        </div>

        <SectionDropdown isOpen={openDropdown === "sections"} onClose={closeDropdown} />
        <VolumeDropdown isOpen={openDropdown === "volumes"} onClose={closeDropdown} />
        <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      </div>
    </header>
  );
}
