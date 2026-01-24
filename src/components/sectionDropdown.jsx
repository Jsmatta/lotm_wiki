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

export function SectionDropdown({ onSectionChange }) {
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setIsOpen(false);
    if (onSectionChange) onSectionChange(section);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-primary normal-case text-base">
        navigate
      </button>
      {isOpen && createPortal(
        <div className="modal modal-open z-1000" onClick={closeModal}>
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
              <button className="btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
