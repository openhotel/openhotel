import React, { useEffect, useState } from "react";
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
import { useTasks } from "shared/hooks";

const DELTA_MULTIPLIER = 0.35;

type Props = {
  onDone?: () => void;
};

export const VignetteTransitionComponent: React.FC<Props> = ({ onDone }) => {
  const { add: addTask } = useTasks();
  const { on } = useEvents();
  const { getSize } = useWindow();

  const [isDone, setIsDone] = useState<boolean>(false);
  const [upperYPosition, setUpperYPosition] = useState<number>(0);
  const [belowYPosition, setBelowYPosition] = useState<number>(0);
  const [size, setSize] = useState<Size>(getSize());

  useEffect(() => {
    const onRemoveSize = on<Size>(Event.RESIZE, setSize);

    setIsDone(false);
    addTask({
      type: TickerQueue.DURATION,
      duration: 750,
      onFunc: (delta) => {
        setUpperYPosition((y) => y - delta * DELTA_MULTIPLIER);
        setBelowYPosition((y) => y + delta * DELTA_MULTIPLIER);
      },
      onDone: () => {
        setIsDone(true);
        onDone?.();
      },
    });

    return () => {
      onRemoveSize();
    };
  }, [setSize, on, setUpperYPosition, setBelowYPosition, addTask]);

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
