import React, { useEffect, useState } from "react";
import { System } from "system";
import { TickerQueue } from "@oh/queue";
import {
  ContainerComponent,
  Event,
  GraphicsComponent,
  GraphicType,
  Size,
  useEvents,
  useWindow,
} from "@oh/pixi-components";

const DELTA_MULTIPLIER = 0.35;

export const VignetteTransitionComponent: React.FC = () => {
  const { on } = useEvents();
  const { getSize } = useWindow();

  const [isDone, setIsDone] = useState<boolean>(false);
  const [upperYPosition, setUpperYPosition] = useState<number>(0);
  const [belowYPosition, setBelowYPosition] = useState<number>(0);
  const [size, setSize] = useState<Size>(getSize());

  useEffect(() => {
    const onRemoveSize = on<Size>(Event.RESIZE, setSize);

    setIsDone(false);
    System.tasks.add({
      type: TickerQueue.DURATION,
      duration: 750,
      onFunc: (delta) => {
        setUpperYPosition((y) => y - delta * DELTA_MULTIPLIER);
        setBelowYPosition((y) => y + delta * DELTA_MULTIPLIER);
      },
      onDone: () => {
        setIsDone(true);
      },
    });

    return () => {
      onRemoveSize();
    };
  }, [setSize, on, setUpperYPosition, setBelowYPosition]);

  return isDone ? null : (
    <ContainerComponent zIndex={Number.MAX_SAFE_INTEGER}>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={size.height / 2}
        tint={1}
        position={{
          y: upperYPosition,
        }}
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={size.height / 2}
        pivot={{
          y: -size.height / 2,
        }}
        position={{
          y: belowYPosition,
        }}
        tint={1}
      />
    </ContainerComponent>
  );
};
