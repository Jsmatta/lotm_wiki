import React, { useState, useEffect } from "react";
import { createPortal } from "preact/compat";
import { Link, useLocation } from "react-router-dom";

export const sections = [
  "Home",
  "Volumes",
  "Characters",
  "Places",
  "Pathways",
  "Gods",
  "Organizations",
  "Spells",
  "Sealed Artifacts",
];

export function SectionDropdown({ isOpen, onClose, selectedSection, onSectionChange }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    // Determine active section based on current URL (HashRouter doesn't have full paths)
    const path = location.pathname;
    if (path === "/") {
      setActiveSection("Home");
    } else if (path === "/characters") {
      setActiveSection("Characters");
    } else if (path === "/pathways") {
      setActiveSection("Pathways");
    }
  }, [location.pathname]);

  const handleSectionChange = (section) => {
    if (onSectionChange) onSectionChange(section);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal modal-open z-1000" onClick={onClose}>
      <div className="modal-box w-11/12 max-w-md border border-accent" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">Select Section</h3>
        <ul className="menu bg-base-100 rounded-box w-full">
          <li>
            <Link 
              to="/" 
              onClick={() => handleSectionChange("Home")}
              className={activeSection === "Home" ? "active" : ""}
            >
              Home {activeSection === "Home" && " ✓"}
            </Link>
          </li>
          <li>
            <Link 
              to="/characters" 
              onClick={() => handleSectionChange("Characters")}
              className={activeSection === "Characters" ? "active" : ""}
            >
              Characters {activeSection === "Characters" && " ✓"}
            </Link>
          </li>
          <li>
            <Link 
              to="/pathways" 
              onClick={() => handleSectionChange("Pathways")}
              className={activeSection === "Pathways" ? "active" : ""}
            >
              Pathways {activeSection === "Pathways" && " ✓"}
            </Link>
          </li>
        </ul>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
