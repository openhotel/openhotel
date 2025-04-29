import React from "react";
import { SpriteSheetEnum } from "shared/enums";
import {
  NineSliceSpriteComponent,
  Point,
  Size,
} from "@openhotel/pixi-components";

type Props = {
  size: Size;
  position?: Point;
};

export const SoftBadgeComponent: React.FC<Props> = ({
  size,
  ...containerProps
}) => {
  return (
    <NineSliceSpriteComponent
      spriteSheet={SpriteSheetEnum.UI}
      texture="background-circle-x6"
      leftWidth={2}
      rightWidth={2}
      topHeight={2}
      bottomHeight={2}
      width={size.width}
      height={size.height}
      tint={0xe0e0e0}
      {...containerProps}
    />
  );
};
