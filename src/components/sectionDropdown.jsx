import React from "react";

export const sections = [
  "Characters",
  "Places",
  "Pathways",
  "Gods",
  "Organizations",
  "Spells",
  "Sealed Artifacts"
];

export function SectionDropdown({ selectedSection, onSectionChange }) { 
  const handleSectionChange = (section) => {
    onSectionChange(section);
  };

  return (
    <div className="dropdown">
      <button tabIndex={0} className="btn btn-primary normal-case text-base">
        Sections ▼
      </button>
      <ul
        tabIndex="-1"
        className="dropdown-content menu bg-base-100 border border-accent rounded-xl z-50 w-52 p-2 shadow-2xl mt-2"
      >
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
    </div>
  );
}
