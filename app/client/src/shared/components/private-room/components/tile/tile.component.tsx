import React, { useMemo } from "react";
import { SpriteSheetEnum } from "shared/enums";
import {
  DisplayObjectProps,
  SpriteComponent,
  SpriteRef,
} from "@oh/pixi-components";
import { Point3d } from "shared/types";
import { getPositionFromIsometricPosition, getSafeZIndex } from "shared/utils";

type Props = {
  position: Point3d;
  spawn?: boolean;
} & Omit<DisplayObjectProps<SpriteRef>, "position">;

export const PrivateRoomTile: React.FC<Props> = ({
  position,
  spawn,
  ...props
}) => {
  const zIndex = useMemo(() => getSafeZIndex(position, -0.1), [position]);
  const $position = useMemo(
    () => getPositionFromIsometricPosition(position),
    [position],
  );

  return (
    <SpriteComponent
      texture="tile"
      zIndex={zIndex}
      spriteSheet={SpriteSheetEnum.ROOM}
      position={$position}
      tint={
        spawn ? 0x2f2f2f : Math.round(zIndex) % 2 === 0 ? 0xa49f7e : 0xb2ad8e
      }
      {...props}
    />
  );
};
