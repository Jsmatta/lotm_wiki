import { useState, useEffect } from "preact/hooks";
import { Link, useLocation } from "react-router-dom";
import { sections } from "../utils/sections.js";
import Modal from "./modal.jsx";

export { sections } from "../utils/sections.js";

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Section">
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
    </Modal>
  );
}
