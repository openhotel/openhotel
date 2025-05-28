import React, { useEffect, useState } from "react";
import { SpriteTextProps } from "@openhotel/pixi-components";
import { TextComponent } from "shared/components/text";
import { useTasks } from "shared/hooks";
import { TickerQueue } from "@oh/queue";

type Props = {
  count: number;
  onDone?: () => void;
} & Omit<SpriteTextProps, "text">;

export const CountdownComponent: React.FC<Props> = ({
  count: initialCount,
  onDone,
  ...textProps
}) => {
  const { add } = useTasks();

  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    setCount(initialCount);
    return add({
      type: TickerQueue.REPEAT,
      repeats: initialCount,
      repeatEvery: 1000,
      onFunc: () => {
        setCount((count) => count - 1);
      },
      onDone,
    });
  }, [setCount, initialCount, onDone]);

  return <TextComponent {...textProps} text={count + ""} />;
};
