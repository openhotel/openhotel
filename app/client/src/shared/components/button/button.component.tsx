import React, { useEffect, useRef, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  ContainerRef,
  NineSliceSpriteComponent,
  Size,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components/text";

type Props = {
  text?: string;
  color?: number;
  padding?: [number, number, number, number];
  children?: React.ReactNode;
} & ContainerProps;

export const ButtonComponent: React.FC<Props> = ({
  text,
  color = 0x1,
  padding = [0, 0, 0, 0],
  children,
  ...containerProps
}) => {
  const containerRef = useRef<ContainerRef>(null);

  const [contentSize, setContentSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const { maxX, maxY } = containerRef.current.getBounds();
    setContentSize({ width: maxX, height: maxY });
  }, [text, children]);

  const [topPadding, rightPadding, bottomPadding, leftPadding] = padding;

  return (
    <ContainerComponent {...containerProps}>
      <NineSliceSpriteComponent
        spriteSheet={SpriteSheetEnum.UI}
        texture="ui-button"
        leftWidth={3}
        rightWidth={3}
        topHeight={3}
        bottomHeight={3}
        width={contentSize.width + rightPadding + leftPadding}
        height={contentSize.height + topPadding + bottomPadding}
      />
      <ContainerComponent
        ref={containerRef}
        position={{
          x: leftPadding,
          y: topPadding,
        }}
      >
        {children ?? <TextComponent text={text} color={color} />}
      </ContainerComponent>
    </ContainerComponent>
  );
};
