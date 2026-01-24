import { useState } from "preact/hooks";
import { createPortal } from "preact/compat";

export const volumes = [
  "Introduction",
  "The Clown",
  "The Faceless",
  "The Traveler",
  "The Undying",
  "The Red Priest",
  "The Lightseeker",
  "The Hanged Man",
  "The Fool",
];

export function useVolumeSelector(initialVolume = 0) {
  const [selectedVolume, setSelectedVolume] = useState(initialVolume);

  return {
    selectedVolume,
    setSelectedVolume,
    volumes,
  };
}

export function VolumeDropdown({ isOpen, onClose, selectedVolume, onVolumeChange }) {
  const handleVolumeChange = (volume) => {
    if (onVolumeChange) onVolumeChange(volume);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal modal-open z-1000 " onClick={onClose}>
      <div className="modal-box w-11/12 max-w-md border border-accent" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">Select Volume</h3>
        <ul className="menu bg-base-100 rounded-box w-full">
          {volumes.map((volume, index) => (
            <li key={index}>
              <a
                onClick={() => handleVolumeChange(index)}
                className={selectedVolume === index ? "active" : ""}
              >
                {volume}
                {selectedVolume === index && " ✓"}
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
