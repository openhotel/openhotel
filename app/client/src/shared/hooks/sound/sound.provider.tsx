import React, { ReactNode, useRef } from "react";
import { SoundContext } from "./sound.context";
import { Howl, Howler } from "howler";
import { SoundsEnum, soundSources } from "./sound.config";

type SoundProps = {
  children: ReactNode;
};

export const SoundProvider: React.FC<SoundProps> = ({ children }) => {
  const soundsRef = useRef<Partial<Record<SoundsEnum, Howl>>>({});

  const $getSound = (sound: SoundsEnum): Howl => {
    if (!soundsRef.current[sound]) {
      const config = soundSources[sound];
      if (!config) throw new Error(`Sound ${sound} not defined in config`);
      soundsRef.current[sound] = new Howl({
        src: config.src,
        ...(config.options || {}),
      });
    }
    return soundsRef.current[sound]!;
  };

  const play = (sound: SoundsEnum) => {
    const $sound = $getSound(sound);
    $sound.play();
  };

  const stop = (sound: SoundsEnum) => {
    const $sound = soundsRef.current[sound];
    $sound?.stop();
  };

  const pauseAll = () =>
    Object.values(soundsRef.current).forEach((sound) => sound?.pause());

  const stopAll = () =>
    Object.values(soundsRef.current).forEach((sound) => sound?.stop());

  const muteAll = () => Howler.mute(true);
  const unmuteAll = () => Howler.mute(false);

  return (
    <SoundContext.Provider
      value={{ play, stop, pauseAll, stopAll, muteAll, unmuteAll }}
    >
      {children}
    </SoundContext.Provider>
  );
};
