import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { createPortal } from "preact/compat";
import { getAllItems } from "../utils/wikiContent.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import { CATEGORIES } from "../config/categories.js";
import Icon from "./icon.jsx";
import { ICON_PATHS } from "../config/icons.js";

const CATEGORY_FILTERS = [
  { key: "all", label: "ALL RECORDS" },
  ...CATEGORIES.map((c) => ({ key: c.key, label: c.title.toUpperCase() })),
];

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const selectedVolume = useSelectedVolume();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [items, setItems] = useState([]);

  // Load all items for current volume
  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setSelectedIndex(0);
    getAllItems(selectedVolume).then(setItems).catch(() => setItems([]));
  }, [isOpen, selectedVolume]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = useMemo(() => {
    let result = items;

    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    const normalized = query.trim().toLowerCase();
    if (normalized) {
      result = result.filter((item) => item.searchText.includes(normalized));
    }

    return result.slice(0, 30); // Max 30 for snappy list
  }, [items, query, activeCategory]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length, query, activeCategory]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigate(filteredItems[selectedIndex].href);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] bg-black/85 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="bg-base-200 border-2 border-base-content brutal-shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette Search"
      >
        {/* Command Search Header */}
        <div className="p-4 bg-base-300 border-b-2 border-base-content flex items-center gap-3">
          <Icon path={ICON_PATHS.search} className="h-5 w-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}
            placeholder="TYPE TO SEARCH CLASSIFIED DOSSIERS..."
            className="grow bg-transparent font-mono text-sm uppercase text-base-content placeholder:text-base-content/50 focus:outline-none"
          />
          <span className="bg-base-100 border border-base-content/40 font-mono text-[10px] font-bold px-1.5 py-0.5 text-base-content/60">
            ESC TO EXIT
          </span>
        </div>

        {/* Category Filters */}
        <div className="px-3 py-2 bg-base-100 border-b-2 border-base-content/20 flex gap-1.5 overflow-x-auto">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-2 py-1 font-mono text-[10px] font-bold whitespace-nowrap border transition-colors ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-content border-black"
                  : "bg-base-200 text-base-content/80 border-base-content/30 hover:border-base-content hover:bg-base-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div ref={listRef} className="overflow-y-auto divide-y divide-base-content/10 flex-1 p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center font-mono">
              <div className="text-warning font-bold text-sm uppercase">[!] NO CLASSIFIED RECORDS FOUND</div>
              <p className="text-xs text-base-content/70 mt-1">
                No entries match your search query within clearance Volume {selectedVolume}.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.href}
                  data-index={idx}
                  onClick={() => {
                    navigate(item.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 flex items-center justify-between gap-4 cursor-pointer transition-colors border ${
                    isSelected
                      ? "bg-accent text-accent-content border-black font-bold brutal-shadow-xs"
                      : "bg-base-100 text-base-content border-transparent hover:bg-base-300 hover:border-base-content/20"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 object-cover object-top border border-black shrink-0 bg-base-300"
                      />
                    ) : (
                      <div className="w-10 h-10 border border-black shrink-0 bg-base-300 flex items-center justify-center font-mono text-[10px] text-base-content/50">
                        N/A
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-mono font-black text-sm uppercase truncate">
                        {item.name}
                      </div>
                      <div className="font-mono text-[10px] opacity-75 uppercase truncate">
                        {item.label} // VOL. {item.introducedInVolume}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 font-mono text-xs font-bold">
                    {isSelected ? "ENTER ↵" : "→"}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-base-300 border-t-2 border-base-content flex items-center justify-between font-mono text-[10px] text-base-content/70">
          <div className="flex items-center gap-3">
            <span>↑↓ NAVIGATE</span>
            <span>↵ SELECT</span>
            <span>ESC CLOSE</span>
          </div>
          <div>
            CLEARANCE: <span className="font-bold text-primary">VOL. {selectedVolume}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
