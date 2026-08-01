import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VolumeDropdown } from "./volumeSelector.jsx";
import { SectionDropdown } from "./sectionDropdown.jsx";
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
    }
  };

  const closeDropdown = () => setOpenDropdown(null);

  return (
    <div className="sticky flex top-4 left-4 right-4 max-w-[calc(100vw-2rem)] h-1 navbar bg-secondary-200 border border-accent shadow-2xl rounded-xl px-4 z-50 backdrop-blur-md bg-opacity-70 overflow-visible">
      <div className="navbar-start">
        <button
          type="button"
          onClick={() => setOpenDropdown("sections")}
          className="btn btn-ghost btn-circle"
          aria-label="Open sections menu"
        >
          <Icon path={ICON_PATHS.menu} />
        </button>
      </div>

      <div className="navbar-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="btn btn-ghost text-xl">LOTM Wiki</Link>
          <button
            type="button"
            onClick={() => setOpenDropdown("volumes")}
            className="btn btn-xs sm:btn-sm btn-accent rounded-full gap-1 normal-case shadow-sm"
            aria-label="Change reading volume"
          >
            {volumeTitle(selectedVolume)}
            <Icon path={ICON_PATHS.chevronDown} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="navbar-end">
        <form onSubmit={handleSearchSubmit} className="flex gap-2" role="search">
          <input
            type="search"
            aria-label="Search wiki"
            placeholder="Search..."
            className="input input-bordered w-24 md:w-auto"
            ref={searchInputRef}
            defaultValue={currentQuery}
          />
        </form>
      </div>

      <SectionDropdown isOpen={openDropdown === "sections"} onClose={closeDropdown} />
      <VolumeDropdown isOpen={openDropdown === "volumes"} onClose={closeDropdown} />
    </div>
  );
}
