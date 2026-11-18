import React, { useEffect, useMemo, useState } from "react";
import { TextureEnum } from "shared/enums";
import { SpriteComponent } from "@openhotel/pixi-components";
import { useTasks } from "shared/hooks";
import { TickerQueue } from "@shared/modules/old/queue/ticker-queue.enum.ts";
import { wait } from "@shared/utils/wait.utils.ts";

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

  return useMemo(
    () => (
      <SpriteComponent
        texture={TextureEnum.HOME_LOGO}
        position={{
          y: yPosition,
        }}
      />
    ),
    [yPosition],
  );
};
