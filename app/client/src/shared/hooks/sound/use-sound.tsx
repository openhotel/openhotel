import { useContext } from "react";
import { SoundContext, SoundContextType } from "./sound.context";

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
