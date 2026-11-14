import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  ContainerRef,
  NineSliceSpriteComponent,
  Sides,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components/text";
import { Size2d } from "shared/types";

type Props = {
  text?: string;
  padding?: Partial<Sides>;
} & ContainerProps;

export const BubbleActionComponent: React.FC<Props> = ({
  text,
  padding,
  ...containerProps
}) => {
  const textRef = useRef<ContainerRef>(null);

  const [size, setSize] = useState<Size2d>({ width: 12, height: 9 });

  const $padding = useMemo(
    () => ({
      left: padding?.left ?? 0,
      right: padding?.right ?? 0,
      top: padding?.top ?? 0,
      bottom: padding?.bottom ?? 0,
    }),
    [padding],
  );

  useEffect(() => {
    setSize((size) => {
      const { width, height } = textRef.current.getSize();

      return {
        width: Math.max(size.width, width + $padding.left + $padding.right),
        height: Math.max(size.height, height + $padding.top + $padding.bottom),
      };
    });
  }, [setSize, $padding]);

  return useMemo(
    () => (
      <ContainerComponent {...containerProps}>
        <NineSliceSpriteComponent
          texture="bubble-user"
          spriteSheet={SpriteSheetEnum.UI}
          leftWidth={8}
          rightWidth={4}
          topHeight={4}
          bottomHeight={5}
          width={size.width}
          height={size.height}
        />
        <TextComponent
          ref={textRef}
          position={{
            x: $padding.left,
            y: $padding.top,
          }}
          text={text}
          color={0}
        />
      </ContainerComponent>
    ),
    [containerProps, size, $padding, text],
  );
};
