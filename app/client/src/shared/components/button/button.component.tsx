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
import { LOADING_STYLES } from "shared/consts";
import { LoadingIconComponent } from "..";

type Props = {
  text: string;
  size: Size;
  isLoading?: boolean;
} & ContainerProps;

export const ButtonComponent: React.FC<Props> = ({
  text,
  size,
  isLoading,
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
        alpha={isLoading ? 0.25 : 1}
      />
      <FlexContainerComponent
        size={size}
        justify={FLEX_JUSTIFY.CENTER}
        align={FLEX_ALIGN.CENTER}
      >
        {isLoading ? (
          <LoadingIconComponent icon={LOADING_STYLES.PULSE} />
        ) : (
          <TextComponent text={text} color={0} />
        )}
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
