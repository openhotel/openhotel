import React, { useState, useEffect } from "react";
import {
  TilingSpriteComponent,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { LOADING_STYLES, LOADING_STYLES_FRAMES } from "shared/consts";

type Props = {
  icon?: string;
  speed?: number;
};

export const LoadingIconComponent: React.FC<Props> = ({
  icon = LOADING_STYLES.PULSE,
  speed = 0.5,
}) => {
  const [loadingFrame, setLoadingFrame] = useState(0);
  
   useEffect(() => {
    const MIN_FRAME = LOADING_STYLES_FRAMES.PULSE.firstFrame;
    const MAX_FRAME = LOADING_STYLES_FRAMES.PULSE.lastFrame;
    let frame = MIN_FRAME;
    let ascending = true;
    console.log("loadingFrame", loadingFrame);
    const interval = setInterval(() => {
      setLoadingFrame(frame);
      if (ascending) {
        frame++;
        if (frame > MAX_FRAME) {
          ascending = false;
          frame = MAX_FRAME - 1; 
        }
      } else {
        frame--;
        if (frame < MIN_FRAME) {
          ascending = true;
          frame = MIN_FRAME;
        }
      }
    }, (1 / speed) * 100);

    return () => {
      clearInterval(interval);
    };
  }, [speed]);

  return (
      <TilingSpriteComponent
        texture={`${icon}-${loadingFrame}`}
        width={8}
        height={8}
        spriteSheet={SpriteSheetEnum.UI}
        alpha={0.25}
        scale={{
          x: 1.0,
          y: 1.0,
        }}
        position={{
          x: 7,
          y: 7,
        }}
      />
  );
};
