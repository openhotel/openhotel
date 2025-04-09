import React, { useEffect, useState } from "react";
import { TextureEnum } from "shared/enums";
import { SpriteComponent } from "@oh/pixi-components";
import { wait } from "shared/utils";
import { TickerQueue } from "@oh/queue";
import { useTasks } from "shared/hooks";

const DELTA_MULTIPLIER = 0.5;
const TARGET_Y = -14;

export const LogoComponent: React.FC = () => {
  const { add: addTask } = useTasks();

  const [yPosition, setYPosition] = useState<number>(-128);

  useEffect(() => {
    wait(1000).then(() => {
      addTask({
        type: TickerQueue.DURATION,
        duration: 500,
        onFunc: (delta) => {
          setYPosition((y) => {
            const targetY = y + delta * DELTA_MULTIPLIER;

            if (targetY >= TARGET_Y) return TARGET_Y;
            return targetY;
          });
        },
      });

      //make sure that finishes on target in case animation fails somehow
      wait(510).then(() => {
        setYPosition(TARGET_Y);
      });
    });
  }, [setYPosition, addTask]);

  return (
    <SpriteComponent
      texture={TextureEnum.HOME_LOGO}
      position={{
        y: yPosition,
      }}
    />
  );
};
