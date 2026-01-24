import { useState } from "preact/hooks";

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

export function VolumeDropdown({ selectedVolume, onVolumeChange }) {
  //change the volume
  const handleVolumeChange = (index) => {
  onVolumeChange(index);
  document.activeElement?.blur(); // 👈 closes the dropdown
};

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 border border-accent rounded-xl z-50 w-52 p-2 shadow-2xl mt-4"
      >
        <li className="menu-title">
          <span>Volumes</span>
        </li>
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
    </div>
  );
}
