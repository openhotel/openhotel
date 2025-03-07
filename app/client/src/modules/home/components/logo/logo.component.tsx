import React, { useEffect, useState } from "react";
import { TextureEnum } from "shared/enums";
import { SpriteComponent } from "@oh/pixi-components";
import { wait } from "shared/utils";
import { System } from "system";
import { TickerQueue } from "@oh/queue";

const DELTA_MULTIPLIER = 0.5;

export const LogoComponent: React.FC = () => {
  const [yPosition, setYPosition] = useState<number>(-128);

  useEffect(() => {
    wait(1000).then(() => {
      System.tasks.add({
        type: TickerQueue.DURATION,
        duration: 500,
        onFunc: (delta) => {
          setYPosition((y) => {
            const targetY = y + delta * DELTA_MULTIPLIER;

            if (targetY >= -14) return -14;
            return targetY;
          });
        },
      });
    });
  }, [setYPosition]);

  return (
    <SpriteComponent
      texture={TextureEnum.HOME_LOGO}
      position={{
        y: yPosition,
      }}
    />
  );
};
