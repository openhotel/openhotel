import React, { useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@openhotel/pixi-components";
import { HotBarItemsComponent } from "shared/components";
import { wait } from "shared/utils";
import { TickerQueue } from "@oh/queue";
import { useTasks } from "shared/hooks";

const DELTA_MULTIPLIER = 0.25;
const TARGET_Y = 0;

type Props = {
  onDone?: () => void;
  width: number;
};

export const HotBarComponent: React.FC<Props> = ({ onDone, width }) => {
  const { add: addTask } = useTasks();

  const [yPosition, setYPosition] = useState<number>(50);

  useEffect(() => {
    wait(1000).then(() => {
      addTask({
        type: TickerQueue.DURATION,
        duration: 500,
        onFunc: (delta) => {
          setYPosition((y) => {
            const targetY = y - delta * DELTA_MULTIPLIER;

            if (TARGET_Y >= targetY) return TARGET_Y;
            return targetY;
          });
        },
        onDone: () => {
          onDone?.();
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
      <ContainerComponent
        pivot={{
          y: 25,
        }}
        position={{
          y: yPosition,
        }}
      >
        <FlexContainerComponent align={FLEX_ALIGN.BOTTOM}>
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.SPACE_EVENLY}
            align={FLEX_ALIGN.CENTER}
            size={{
              width,
              height: 40,
            }}
          >
            <HotBarItemsComponent />
          </FlexContainerComponent>
        </FlexContainerComponent>
      </ContainerComponent>
    ),
    [yPosition, width],
  );
};
