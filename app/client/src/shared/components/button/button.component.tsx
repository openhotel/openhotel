import React from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
  Size,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components/text";

type Props = {
  text: string;
  size: Size;
  color?: number;
} & ContainerProps;

export const ButtonComponent: React.FC<Props> = ({
  text,
  size,
  color,
  ...containerProps
}) => {
  return (
    <ContainerComponent
      {...containerProps}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
    >
      <NineSliceSpriteComponent
        spriteSheet={SpriteSheetEnum.UI}
        texture="ui-button"
        leftWidth={3}
        rightWidth={3}
        topHeight={3}
        bottomHeight={3}
        width={size.width}
        height={size.height}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
      />
      <FlexContainerComponent
        size={size}
        justify={FLEX_JUSTIFY.CENTER}
        align={FLEX_ALIGN.CENTER}
      >
        <TextComponent text={text} color={color ?? 0} />
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
