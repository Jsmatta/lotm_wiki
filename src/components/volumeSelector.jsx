import { VOLUMES } from "../config/volumes.js";
import { useSelectVolume, useSelectedVolume } from "../utils/volumeContext.jsx";
import Modal from "./modal.jsx";

export function VolumeDropdown({ isOpen, onClose }) {
  const selectedVolume = useSelectedVolume();
  const selectVolume = useSelectVolume();

  const handleSelect = (index) => {
    selectVolume(index);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Volume">
      <ul className="menu bg-base-100 rounded-box w-full">
        {VOLUMES.map((volume, index) => (
          <li key={volume}>
            <button
              type="button"
              onClick={() => handleSelect(index)}
              aria-current={selectedVolume === index ? "true" : undefined}
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
