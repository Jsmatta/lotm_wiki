import React, { useState } from "react";
import { createPortal } from "preact/compat";

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
  const handleSectionChange = (section) => {
    if (onSectionChange) onSectionChange(section);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal modal-open z-1000" onClick={onClose}>
      <div className="modal-box w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">Select Section</h3>
        <ul className="menu bg-base-100 rounded-box w-full">
          {sections.map((section, index) => (
            <li key={index}>
              <a
                onClick={() => handleSectionChange(section)}
                className={selectedSection === section ? "active" : ""}
              >
                {section}
                {selectedSection === section && " ✓"}
              </a>
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
