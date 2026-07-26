import { useState } from "preact/hooks";
import Modal from "./modal.jsx";

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Volume">
      <ul className="menu bg-base-100 rounded-box w-full">
        {volumes.map((volume, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => handleVolumeChange(index)}
              className={selectedVolume === index ? "active" : ""}
            >
              {volume}
              {selectedVolume === index && " ✓"}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
