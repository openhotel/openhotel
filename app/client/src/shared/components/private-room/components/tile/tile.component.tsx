import React, { useMemo } from "react";
import { SpriteSheetEnum } from "shared/enums";
import {
  Cursor,
  DisplayObjectProps,
  EventMode,
  GraphicsComponent,
  GraphicType,
  SpriteComponent,
  SpriteRef,
} from "@openhotel/pixi-components";
import { Point3d } from "shared/types";
import {
  getPositionFromIsometricPosition,
  getTilePolygon,
  getZIndex,
} from "shared/utils";
import { SAFE_Z_INDEX } from "shared/consts";

type Props = {
  position: Point3d;
  spawn?: boolean;
  onPointerDown?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  color?: number;
} & Omit<DisplayObjectProps<SpriteRef>, "position">;

export const PrivateRoomTile: React.FC<Props> = ({
  position,
  spawn,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
  color,
  ...props
}) => {
  const zIndex = useMemo(() => getZIndex(position, 0.1), [position]);
  const $position = useMemo(
    () => getPositionFromIsometricPosition(position),
    [position],
  );

  return useMemo(
    () => (
      <>
        <GraphicsComponent
          zIndex={SAFE_Z_INDEX + zIndex}
          type={GraphicType.POLYGON}
          polygon={getTilePolygon({ width: 12, height: 12 })}
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
          position={$position}
          pivot={{
            x: -27,
          }}
          tint={0xcccc00}
          alpha={0}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
        <SpriteComponent
          texture="tile"
          zIndex={zIndex}
          spriteSheet={SpriteSheetEnum.ROOM}
          position={$position}
          eventMode={EventMode.NONE}
          tint={
            color ??
            (spawn
              ? 0x2f2f2f
              : Math.round(position.x + position.z) % 2 === 0
                ? 0xa49f7e
                : 0xb2ad8e)
          }
          {...props}
        />
      </>
    ),
    [
      zIndex,
      $position,
      onPointerDown,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      zIndex,
      $position,
      color,
      spawn,
      props,
    ],
  );
};
