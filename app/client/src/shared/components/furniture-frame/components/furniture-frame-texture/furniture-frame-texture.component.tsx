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
  DUMMY_FURNITURE_FRAME_DATA,
  SAFE_Z_INDEX,
  TILE_SIZE,
  WALL_HEIGHT,
  WALL_WIDTH,
} from "shared/consts";
import {
  getPositionFromIsometricPosition,
  getWallPositionFromIsometricPosition,
  getZIndex,
} from "shared/utils";
import { CrossDirection } from "shared/enums";
import { Point2d, Point3d, RoomPoint, Size2d, Size3d } from "shared/types";

type Props = {
  texture: string;
  spriteSheet: string;

  direction?: CrossDirection;
  framePosition: Point2d;

  pivot: Point2d;
  zIndex: number;
  hitArea: number[];
  position: Point3d;
  size?: Size3d;

  disableHitArea: boolean;
  roomLayout?: RoomPoint[][];
  isBeingPlaced: boolean;

  onPointerDown: () => void;
};

export const FurnitureFrameTextureComponent: React.FC<Props> = ({
  texture,
  spriteSheet,

  direction,
  framePosition,

  pivot,
  zIndex,
  hitArea,
  position,
  size,

  disableHitArea,
  roomLayout,
  isBeingPlaced,

  onPointerDown,
}) => {
  const spriteRef = useRef<SpriteRef>(null);

  const [$bounds, setBounds] = useState<Size2d>({ width: 0, height: 0 });

  const pos = useMemo(
    () => getWallPositionFromIsometricPosition(framePosition, direction),
    [framePosition, direction],
  );
  const isoPos = {
    x: position.x,
    y: 0,
    z: position.z,
  };
  const $position = useMemo(
    () => getPositionFromIsometricPosition(isoPos),
    [isoPos],
  );
  const $$position = useMemo(
    () => ({
      x: $position.x + pos.x,
      y: $position.y + pos.y,
    }),
    [$position, pos],
  );
  const $size = useMemo(() => size ?? DUMMY_FURNITURE_FRAME_DATA.size, [size]);
  const $pivot = useMemo(
    () => ({
      x:
        (direction === CrossDirection.EAST
          ? -TILE_SIZE.width + $bounds.width / 2 + +TILE_SIZE.width / 2
          : -1 + $bounds.width - $bounds.width / 2 + -TILE_SIZE.width / 2) +
        pivot.x,
      y: $bounds.height / 2 - $size.height / 2 + TILE_SIZE.height / 2 + pivot.y,
    }),
    [direction, pivot, $bounds, $size],
  );

  const $hitArea = useMemo(
    () =>
      hitArea ??
      (direction === CrossDirection.NORTH
        ? [
            //
            0,
            $size.width,
            //
            $size.width * 2,
            0,
            //
            $size.width * 2,
            $size.height,
            //
            0,
            $size.width + $size.height,
            //
          ]
        : [
            //
            0,
            0,
            //
            $size.width * 2,
            $size.width,
            //
            $size.width * 2,
            $size.width + $size.height,
            //
            0,
            $size.height,
            //
          ]),
    [direction, $size],
  );

  useEffect(() => {
    if (!spriteRef.current) return;

    const { width, height } = spriteRef.current.texture.frame;

    setBounds({ width, height });
  }, [setBounds]);

  const renderSprites = useMemo(() => {
    let renderSprites = [];

    const splices = Math.ceil(
      Math.ceil($bounds.width / (TILE_SIZE.width / 2)) / 2,
    );

    for (let i = -splices; i < splices + 1; i++) {
      const $isoMaskPosition = {
        x: isoPos.x + (direction === CrossDirection.NORTH ? 0 : i),
        y: 0,
        z: isoPos.z + (direction === CrossDirection.EAST ? 0 : i),
      };
      const targetTile = roomLayout?.[$isoMaskPosition.z]?.[$isoMaskPosition.x];

      // if (roomLayout && (!targetTile || targetTile === "x")) continue;

      const $targetMaskPosition =
        getPositionFromIsometricPosition($isoMaskPosition);
      const $maskPosition = {
        x:
          $targetMaskPosition.x +
          1 +
          (direction === CrossDirection.EAST ? TILE_SIZE.width / 2 : 0),
        y: $targetMaskPosition.y + 2,
      };
      const $zIndex = getZIndex(
        {
          x: $isoMaskPosition.x,
          z: $isoMaskPosition.z,
          y: -(isNaN(targetTile as any) ? 0 : targetTile) + 1,
        },
        0.05,
      );

      const margin = 50;

      const $maskPolygon =
        direction === CrossDirection.NORTH
          ? [
              0,
              -WALL_HEIGHT + 9 + WALL_WIDTH - margin,
              TILE_SIZE.width / 2,
              -WALL_HEIGHT + WALL_WIDTH - 3 - margin,
              TILE_SIZE.width / 2,
              -2 - position.y + 50,
              0,
              10 - position.y + 50,
            ]
          : [
              0,
              -WALL_HEIGHT + WALL_WIDTH - 3 - margin,
              TILE_SIZE.width / 2,
              -WALL_HEIGHT + 9 + WALL_WIDTH - margin,
              TILE_SIZE.width / 2,
              10 - position.y + margin,
              0,
              -2 - position.y + margin,
            ];

      renderSprites.push(
        <React.Fragment key={texture + i}>
          <SpriteComponent
            ref={i === 0 ? spriteRef : null}
            texture={texture}
            spriteSheet={spriteSheet}
            pivot={$pivot}
            zIndex={$zIndex}
            position={$$position}
            eventMode={EventMode.NONE}
            maskPolygon={$maskPolygon}
            maskPosition={$maskPosition}
            alpha={isBeingPlaced ? 0.5 : 1}
          />
          {/*<GraphicsComponent*/}
          {/*  type={GraphicType.POLYGON}*/}
          {/*  polygon={$maskPolygon}*/}
          {/*  tint={0xff00ff - Math.random()}*/}
          {/*  position={$maskPosition}*/}
          {/*  alpha={0.5}*/}
          {/*  zIndex={99999999999}*/}
          {/*/>*/}
        </React.Fragment>,
      );
    }
    return renderSprites;
  }, [$bounds, spriteSheet, texture, roomLayout, isBeingPlaced, $$position]);

  return useMemo(
    () => (
      <>
        {renderSprites}

        {disableHitArea ? null : (
          <GraphicsComponent
            type={GraphicType.POLYGON}
            tint={0xff00ff}
            alpha={0}
            polygon={$hitArea}
            pivot={$pivot}
            zIndex={SAFE_Z_INDEX + zIndex}
            position={$$position}
            eventMode={EventMode.STATIC}
            cursor={Cursor.CONTEXT_MENU}
            onPointerDown={onPointerDown}
          />
        )}
      </>
    ),
    [
      renderSprites,
      disableHitArea,
      $hitArea,
      $pivot,
      zIndex,
      $$position,
      onPointerDown,
    ],
  );
};
