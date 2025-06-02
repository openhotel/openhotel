import React, { useEffect, useMemo } from "react";
import {
  Cursor,
  EventMode,
  GraphicsComponent,
  GraphicType,
  SpriteComponent,
  useUpdate,
} from "@openhotel/pixi-components";
import {
  DUMMY_FURNITURE_FRAME_DATA,
  SAFE_Z_INDEX,
  TILE_SIZE,
  WALL_HEIGHT,
  WALL_WIDTH,
} from "shared/consts";
import { CrossDirection } from "shared/enums";
import { Point2d, Point3d, RoomPoint } from "shared/types";
import { getPositionFromIsometricPosition, getZIndex } from "shared/utils";
import { useFurniture } from "shared/hooks";
import { getWallPositionFromIsometricPosition } from "shared/utils/wall.utils";
import { ulid } from "ulidx";

type Props = {
  id?: string;
  furnitureId?: string;
  position: Point3d;

  direction?: CrossDirection;
  framePosition: Point2d;

  onPointerDown?: () => void;

  disableHitArea?: boolean;
  roomLayout?: RoomPoint[][];
  isBeingPlaced?: boolean;
};

export const FurnitureFrameComponent: React.FC<Props> = ({
  id = ulid(),
  position,
  framePosition,
  furnitureId,
  direction = CrossDirection.NORTH,
  onPointerDown,
  disableHitArea = false,
  roomLayout,
  isBeingPlaced = false,
}) => {
  const { load: loadFurniture, get: getFurniture } = useFurniture();
  const { update, lastUpdate } = useUpdate();

  useEffect(() => {
    loadFurniture(furnitureId).then(update);
  }, [furnitureId, loadFurniture, update]);

  const data = useMemo(
    () => getFurniture(furnitureId) ?? DUMMY_FURNITURE_FRAME_DATA,
    [getFurniture, furnitureId, lastUpdate],
  );

  const $data = useMemo(
    () => (data ? data : DUMMY_FURNITURE_FRAME_DATA),
    [data],
  );
  const $direction = useMemo(
    () => (data && direction ? direction : CrossDirection.NORTH),
    [data, direction],
  );
  const $zIndex = useMemo(() => getZIndex(position), [position]);

  return useMemo(
    () =>
      $data.direction[$direction].textures.map(
        ({ texture, bounds, pivot, zIndex, hitArea }) => {
          const pos = getWallPositionFromIsometricPosition(
            framePosition,
            direction,
          );
          const isoPos = {
            x: position.x,
            y: 0,
            z: position.z,
          };
          const $position = getPositionFromIsometricPosition(isoPos);
          const $$position = {
            x: $position.x + pos.x,
            y: $position.y + pos.y,
          };
          const $size = $data?.size ?? DUMMY_FURNITURE_FRAME_DATA.size;
          const $pivot = {
            x:
              (direction === CrossDirection.EAST
                ? -TILE_SIZE.width + bounds.width / 2 + +TILE_SIZE.width / 2
                : -1 + bounds.width - bounds.width / 2 + -TILE_SIZE.width / 2) +
              pivot.x,
            y:
              bounds.height / 2 -
              $size.height / 2 +
              TILE_SIZE.height / 2 +
              pivot.y,
          };

          let renderSprites = [];

          const splices = Math.ceil(
            Math.ceil(bounds.width / (TILE_SIZE.width / 2)) / 2,
          );

          for (let i = -splices; i < splices + 1; i++) {
            const $isoMaskPosition = {
              x: isoPos.x + (direction === CrossDirection.NORTH ? 0 : i),
              y: 0,
              z: isoPos.z + (direction === CrossDirection.EAST ? 0 : i),
            };
            const targetTile =
              roomLayout?.[$isoMaskPosition.z]?.[$isoMaskPosition.x];

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
              <React.Fragment key={id + texture + i}>
                <SpriteComponent
                  texture={texture}
                  spriteSheet={$data.spriteSheet}
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

          const $hitArea =
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
                ]);

          return (
            <React.Fragment key={id}>
              {renderSprites}

              {disableHitArea ? null : (
                <GraphicsComponent
                  type={GraphicType.POLYGON}
                  tint={0xff00ff}
                  alpha={0}
                  polygon={$hitArea}
                  pivot={$pivot}
                  zIndex={SAFE_Z_INDEX + $zIndex}
                  position={$$position}
                  eventMode={EventMode.STATIC}
                  cursor={Cursor.CONTEXT_MENU}
                  onPointerDown={onPointerDown}
                />
              )}
            </React.Fragment>
          );
        },
      ),
    [
      $data,
      $direction,
      position,
      id,
      disableHitArea,
      roomLayout,
      isBeingPlaced,
    ],
  );
};
