import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ContainerRef,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components";

type Props = {
  type?: "left" | "mid" | "right";
  selected?: boolean;
  padding?: number;
  text?: string;
  color?: number;
};

const DATA_MAP = {
  left: {
    leftWidth: 8,
    rightWidth: 2,
    topHeight: 9,
    bottomHeight: 9,
    height: 23,
  },
  mid: {
    leftWidth: 3,
    rightWidth: 3,
    topHeight: 3,
    bottomHeight: 3,
    height: 18,
  },
  right: {
    leftWidth: 2,
    rightWidth: 7,
    topHeight: 7,
    bottomHeight: 6,
    height: 18,
  },
};

export const NavigatorButtonComponent: React.FC<Props> = ({
  type = "left",
  selected = false,
  padding = 20,
  text,
  color = 1,
}) => {
  const textRef = useRef<ContainerRef>(null);

  // const [width, setWidth] = useState<number>(null);
  //
  // useEffect(() => {
  //   setWidth((width) => width ?? textRef.current.getSize().width + padding);
  // }, [setWidth, padding]);

  const props = useMemo(
    () => ({
      ...DATA_MAP[type],
      texture: `ui-tab-button-${type}-${selected ? "" : "un"}selected`,
    }),
    [type, selected],
  );

  // console.log(width, "<<<<<<<<<<<<<", text);

  const width = (textRef?.current?.getSize?.()?.width ?? 0) + padding;

  return (
    <>
      <NineSliceSpriteComponent
        zIndex={10}
        spriteSheet={SpriteSheetEnum.UI}
        width={width}
        {...props}
      />
      <FlexContainerComponent
        zIndex={11}
        position={{
          y: 7,
        }}
        justify={FLEX_JUSTIFY.CENTER}
        size={{
          width,
        }}
      >
        <TextComponent ref={textRef} text={text} tint={color} />
      </FlexContainerComponent>
    </>
  );
};
