import { createContext } from "preact";
import { useContext } from "preact/hooks";

const VolumeContext = createContext(0);

export const VolumeProvider = VolumeContext.Provider;

export function useSelectedVolume() {
  return useContext(VolumeContext);
}
