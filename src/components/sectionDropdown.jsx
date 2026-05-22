import React, { useState, useEffect } from "react";
import { createPortal } from "preact/compat";
import { Link, useLocation } from "react-router-dom";

export const sections = [
  { label: "Home", path: "/" },
  { label: "Volumes", path: "/volumes" },
  { label: "Characters", path: "/characters" },
  { label: "Places", path: "/places" },
  { label: "Pathways", path: "/pathways" },
  { label: "Gods", path: "/gods" },
  { label: "Organizations", path: "/organizations" },
  { label: "Spells", path: "/spells" },
  { label: "Sealed Artifacts", path: "/sealed-artifacts" },
];

export function SectionDropdown({ isOpen, onClose, selectedSection, onSectionChange }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    const path = location.pathname;
    const section = sections
      .filter((item) => item.path !== "/")
      .find((item) => path === item.path || path.startsWith(`${item.path}/`));

    setActiveSection(section?.label || "Home");
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
          {sections.map((section) => (
            <li key={section.path}>
              <Link
                to={section.path}
                onClick={() => handleSectionChange(section.label)}
                className={activeSection === section.label ? "active" : ""}
              >
                {section.label} {activeSection === section.label && " ✓"}
              </Link>
            </li>
          ))}
        </ul>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
