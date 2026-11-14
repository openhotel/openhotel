import React from "react";
import { SoundsEnum } from "./sound.config";

export type SoundContextType = {
  play: (sound: SoundsEnum) => void;
  stop: (sound: SoundsEnum) => void;
  pauseAll: () => void;
  stopAll: () => void;
  muteAll: () => void;
  unmuteAll: () => void;
};

export const SoundContext = React.createContext<SoundContextType>(undefined);
