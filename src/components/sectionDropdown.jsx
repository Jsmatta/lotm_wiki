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
    <Modal isOpen={isOpen} onClose={onClose} title="Select Section">
      <ul className="menu bg-base-100 rounded-box w-full">
        {NAV_SECTIONS.map((section) => {
          const isActive = activePath === section.path;

          return (
            <li key={section.path}>
              <Link
                to={section.path}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "active" : ""}
              >
                {section.label}
                {isActive && " ✓"}
              </Link>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
