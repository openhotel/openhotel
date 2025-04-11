import React, { useMemo } from "react";
import { CrossDirection, SpriteSheetEnum } from "shared/enums";
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
import { getPositionFromIsometricPosition, getSafeZIndex } from "shared/utils";
import { SAFE_Z_INDEX, STEP_TILE_HEIGHT, TILE_Y_HEIGHT } from "shared/consts";

type Props = {
  position: Point3d;
  spawn?: boolean;
  direction: CrossDirection.NORTH | CrossDirection.EAST;
  onPointerDown?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
} & Omit<DisplayObjectProps<SpriteRef>, "position">;

export const PrivateRoomStairs: React.FC<Props> = ({
  position,
  direction,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}) => {
  const zIndex = useMemo(() => getSafeZIndex(position, -0.1), [position]);
  const $position = useMemo(
    () => getPositionFromIsometricPosition(position),
    [position],
  );

  const directionText = useMemo(
    () => (direction === CrossDirection.NORTH ? "x" : "z"),
    [direction],
  );

  return (
    <>
      <GraphicsComponent
        zIndex={SAFE_Z_INDEX + zIndex}
        type={GraphicType.POLYGON}
        polygon={[-2, -7, 24, 30, 0, 42, -25, 6]}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        position={$position}
        pivot={{
          x: direction === CrossDirection.NORTH ? -26 : -24,
          y: 18,
        }}
        tint={0x00cccc}
        alpha={0}
        scale={{
          x: direction === CrossDirection.NORTH ? 1 : -1,
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      />
      <SpriteComponent
        zIndex={zIndex}
        texture={`stairs-${directionText}`}
        spriteSheet={SpriteSheetEnum.ROOM}
        position={$position}
        eventMode={EventMode.NONE}
        tint={Math.round(zIndex) % 2 === 0 ? 0xa49f7e : 0xb2ad8e}
        pivot={{
          y: TILE_Y_HEIGHT - STEP_TILE_HEIGHT,
        }}
      />
    </>
  );
};
