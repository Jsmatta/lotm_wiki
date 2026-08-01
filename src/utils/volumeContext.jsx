import { createContext } from "preact";
import { useCallback, useContext, useState } from "preact/hooks";
import { startTransition } from "preact/compat";
import { FIRST_VOLUME, clampVolume } from "../config/volumes.js";

const STORAGE_KEY = "selectedVolume";

// Value and setter are separate contexts so components that only change the
// volume (the navbar) do not re-render when the volume changes.
const VolumeContext = createContext(FIRST_VOLUME);
const SelectVolumeContext = createContext(() => {});

function readStoredVolume() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Clamp rather than trust: a stale or corrupt value must never resolve to
    // a volume that reveals more than the reader chose.
    return saved === null ? FIRST_VOLUME : clampVolume(saved);
  } catch {
    return FIRST_VOLUME;
  }
}

export function VolumeProvider({ children }) {
  const [selectedVolume, setSelectedVolume] = useState(readStoredVolume);

  const selectVolume = useCallback((volume) => {
    const next = clampVolume(volume);

    // Re-parsing every category is interruptible work; keep the click responsive.
    startTransition(() => setSelectedVolume(next));

    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Private browsing or a full quota — the selection still applies for
      // this session.
    }
  }, []);

  return (
    <SelectVolumeContext.Provider value={selectVolume}>
      <VolumeContext.Provider value={selectedVolume}>
        {children}
      </VolumeContext.Provider>
    </SelectVolumeContext.Provider>
  );
}

export function useSelectedVolume() {
  return useContext(VolumeContext);
}

export function useSelectVolume() {
  return useContext(SelectVolumeContext);
}
