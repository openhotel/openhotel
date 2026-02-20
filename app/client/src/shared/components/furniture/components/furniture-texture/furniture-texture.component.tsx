import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Cursor,
  EventMode,
  GraphicsComponent,
  GraphicType,
  SpriteComponent,
  SpriteRef,
} from "@openhotel/pixi-components";
import {
  DUMMY_FURNITURE_DATA,
  FURNITURE_SAFE_TILE_MARGIN,
  SAFE_Z_INDEX,
  TILE_SIZE,
  TILE_Y_HEIGHT,
} from "shared/consts";
import {
  getPositionFromIsometricPosition,
  getZIndex,
  getCubePolygon,
} from "shared/utils";
import { Point2d, Point3d, Size3d } from "shared/types";

type Props = {
  texture: string;
  spriteSheet: string;

  pivot: Point2d;
  zIndex: number;
  hitArea: number[];
  position: Point3d;
  size: Size3d;

  disableHitArea: boolean;
  isBeingPlaced: boolean;
  heightCorrection: boolean;

  onPointerDown: () => void;
};

export const FurnitureTextureComponent: React.FC<Props> = ({
  texture,
  spriteSheet,

  pivot,
  zIndex,
  hitArea,
  position,
  size,

  disableHitArea,
  isBeingPlaced,
  heightCorrection,

  onPointerDown,
}) => {
  const spriteRef = useRef<SpriteRef>(null);

  const [$pivot, setPivot] = useState<Point2d>({ x: 0, y: 0 });

  const $position = useMemo(
    () => getPositionFromIsometricPosition(position, heightCorrection),
    [position, heightCorrection],
  );
  const $size = useMemo(() => size ?? DUMMY_FURNITURE_DATA.size, [size]);
  const $zIndex = useMemo(
    () =>
      getZIndex(
        {
          ...position,
          y: position.y / TILE_Y_HEIGHT,
        },
        0.5,
      ),
    [position],
  );

  useEffect(() => {
    if (!spriteRef.current) return;

    const { width, height } = spriteRef.current.texture.frame;

    setPivot({
      x: width / 2 - pivot.x - TILE_SIZE.width / 2 - 1,
      y: height - pivot.y - TILE_SIZE.height / 2,
    });
  }, [pivot, setPivot]);

  return (
    <>
      <SpriteComponent
        ref={spriteRef}
        texture={texture}
        spriteSheet={spriteSheet}
        pivot={$pivot}
        zIndex={$zIndex}
        position={$position}
        alpha={isBeingPlaced ? 0.5 : 1}
      />

      {disableHitArea ? null : (
        <GraphicsComponent
          type={GraphicType.POLYGON}
          tint={0xffff00}
          alpha={0}
          polygon={
            hitArea ??
            getCubePolygon({
              width: TILE_SIZE.width,
              height: $size.height - FURNITURE_SAFE_TILE_MARGIN,
            })
          }
          pivot={{
            x: -1,
            y: FURNITURE_SAFE_TILE_MARGIN,
          }}
          zIndex={SAFE_Z_INDEX + $zIndex}
          position={$position}
          eventMode={EventMode.STATIC}
          cursor={Cursor.CONTEXT_MENU}
          onPointerDown={onPointerDown}
        />
      )}
    </>
  );
};
