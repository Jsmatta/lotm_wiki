import { useEffect, useRef, useState } from "preact/hooks";
import { Link } from "react-router-dom";
import { getCategoryItem } from "../utils/wikiContent.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import { truncateText } from "../utils/textUtils.js";

// Cache previews in memory to make hover instantaneous after first fetch
const previewCache = new Map();

export default function HoverLink({ href, children, className }) {
  const selectedVolume = useSelectedVolume();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, placeAbove: false });

  const linkRef = useRef(null);
  const timeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Parse category and id from href, e.g. "/characters/klein_moretti" -> ["characters", "klein_moretti"]
  const parts = href.replace(/^\//, "").split("/");
  const isWikiEntry = parts.length === 2;
  const [categoryKey, entryId] = isWikiEntry ? parts : [null, null];

  const handleMouseEnter = () => {
    if (!isWikiEntry) return;

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(async () => {
      if (!linkRef.current) return;
      const rect = linkRef.current.getBoundingClientRect();
      const placeAbove = rect.bottom + 220 > window.innerHeight;

      setPos({
        top: placeAbove ? rect.top - 8 : rect.bottom + 8,
        left: Math.max(16, Math.min(rect.left, window.innerWidth - 300)),
        placeAbove,
      });

      const cacheKey = `${categoryKey}:${entryId}:${selectedVolume}`;
      if (previewCache.has(cacheKey)) {
        setData(previewCache.get(cacheKey));
        setIsOpen(true);
        return;
      }

      setLoading(true);
      setIsOpen(true);
      try {
        const item = await getCategoryItem(categoryKey, entryId, selectedVolume);
        if (item) {
          const previewObj = {
            name: item.name,
            label: item.label,
            introducedInVolume: item.introducedInVolume,
            image: item.image,
            preview: truncateText(item.plainText, 120),
          };
          previewCache.set(cacheKey, previewObj);
          setData(previewObj);
        } else {
          setData(null);
        }
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <span
      className="relative inline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link ref={linkRef} to={href} className={className}>
        {children}
      </Link>

      {isOpen && isWikiEntry && (
        <div
          style={{
            position: "fixed",
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            transform: pos.placeAbove ? "translateY(-100%)" : "none",
            zIndex: 1500,
          }}
          className="w-72 bg-base-200 border-2 border-base-content brutal-shadow-lg p-3.5 pointer-events-auto font-mono text-left animate-in fade-in duration-150"
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          {loading ? (
            <div className="py-4 text-center text-xs text-base-content/70">
              <span className="inline-block animate-pulse">[ DIVINING PREVIEW... ]</span>
            </div>
          ) : data ? (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                {data.image ? (
                  <img
                    src={data.image}
                    alt=""
                    className="w-12 h-12 object-cover object-top border border-black shrink-0 bg-base-300"
                  />
                ) : (
                  <div className="w-12 h-12 border border-black shrink-0 bg-base-300 flex items-center justify-center text-[10px] text-base-content/50">
                    N/A
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-mono font-black text-xs uppercase truncate text-base-content">
                    {data.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="bg-accent text-accent-content text-[9px] font-bold px-1 border border-black uppercase">
                      {data.label}
                    </span>
                    <span className="text-[9px] text-base-content/70 font-bold">
                      VOL. {data.introducedInVolume}
                    </span>
                  </div>
                </div>
              </div>

              {data.preview && (
                <p className="font-sans text-xs text-base-content/85 leading-relaxed line-clamp-3 pt-1 border-t border-base-content/10">
                  {data.preview}
                </p>
              )}

              <div className="pt-1 text-[10px] font-bold text-primary flex items-center justify-between">
                <span>CLICK TO OPEN DOSSIER</span>
                <span>→</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-base-content/60 py-1">
              [CLASSIFIED // HIGHER CLEARANCE REQUIRED]
            </div>
          )}
        </div>
      )}
    </span>
  );
}
