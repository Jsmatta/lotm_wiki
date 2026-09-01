import { useMemo } from "preact/hooks";
import { Link, useLocation } from "react-router-dom";
import { NAV_SECTIONS } from "../config/categories.js";
import Modal from "./modal.jsx";

/** The active section is derived from the URL — no separate state to keep in sync. */
function useActiveSection() {
  const { pathname } = useLocation();

  return useMemo(() => {
    const section = NAV_SECTIONS.find(
      (item) => item.path !== "/"
        && (pathname === item.path || pathname.startsWith(`${item.path}/`)),
    );

    return section?.path ?? "/";
  }, [pathname]);
}

export function SectionDropdown({ isOpen, onClose }) {
  const activePath = useActiveSection();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Archive Section">
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {NAV_SECTIONS.map((section) => {
          const isActive = activePath === section.path;

          return (
            <Link
              key={section.path}
              to={section.path}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`block w-full text-left p-3 border-2 font-mono text-xs flex items-center justify-between transition-colors brutal-shadow-xs ${
                isActive
                  ? "bg-primary text-primary-content border-black font-bold"
                  : "bg-base-100 text-base-content border-base-content/40 hover:border-base-content hover:bg-base-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="opacity-70 font-mono">//</span>
                <span className="uppercase">{section.label}</span>
              </div>
              {isActive && <span className="font-black text-sm">✓ OPEN</span>}
            </Link>
          );
        })}
      </div>
    </Modal>
  );
}
