import React, { useMemo } from "react";
import {
  Cursor,
  EventMode,
  GraphicsComponent,
  GraphicType,
  SpriteComponent,
} from "@openhotel/pixi-components";
import {
  DUMMY_FURNITURE_FRAME_DATA,
  SAFE_Z_INDEX,
  TILE_SIZE,
} from "shared/consts";
import { CrossDirection } from "shared/enums";
import { FurnitureData, Point2d, Point3d } from "shared/types";
import { getPositionFromIsometricPosition, getZIndex } from "shared/utils";
import { useFurniture } from "shared/hooks";
import { getWallPositionFromIsometricPosition } from "shared/utils/wall.utils";
import { ulid } from "ulidx";

type Props = {
  id: string;
  furnitureId?: string;
  position: Point3d;

  direction: CrossDirection;
  framePosition: Point2d;

  onPointerDown?: () => void;

  interactive?: boolean;
};

export const FurnitureFrameComponent: React.FC<Props> = ({
  id,
  furnitureId,
  position,
  direction,
  framePosition,
  onPointerDown,
  interactive = true,
}) => {
  const { get: getFurniture } = useFurniture();

  const furnitureData = getFurniture(furnitureId);

  return (
    <FurnitureFrameComponentWrapper
      id={id}
      position={position}
      data={furnitureData}
      framePosition={framePosition}
      direction={direction}
      onPointerDown={onPointerDown}
      interactive={interactive}
    />
  );
};

type PropsWrapper = {
  id?: string;

  position: Point3d;
  framePosition: Point2d;

  data?: FurnitureData;

  direction?: CrossDirection;
  onPointerDown?: () => void;

  interactive?: boolean;
};

export const FurnitureFrameComponentWrapper: React.FC<PropsWrapper> = ({
  id = ulid(),
  position,
  framePosition,
  data = DUMMY_FURNITURE_FRAME_DATA,
  direction = CrossDirection.NORTH,
  onPointerDown,
  interactive = true,
}) => {
  const $data = useMemo(
    () => (data ? data : DUMMY_FURNITURE_FRAME_DATA),
    [data],
  );
  const $direction = useMemo(
    () => (data && direction ? direction : CrossDirection.NORTH),
    [data, direction],
  );

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
          const $zIndex = getZIndex(isoPos);
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
              <SpriteComponent
                texture={texture}
                spriteSheet={$data.spriteSheet}
                pivot={$pivot}
                zIndex={$zIndex}
                position={$$position}
                eventMode={EventMode.NONE}
                // mask={
                //   <GraphicsComponent
                //     type={GraphicType.POLYGON}
                //     tint={0xff00ff}
                //     polygon={[
                //       0,
                //       0,
                //       TILE_SIZE.width / 2,
                //       0,
                //       TILE_SIZE.width / 2,
                //       bounds.height,
                //       0,
                //       bounds.height,
                //     ]}
                //     zIndex={SAFE_Z_INDEX + $zIndex}
                //     pivot={{
                //       x:
                //         direction === CrossDirection.NORTH
                //           ? TILE_WIDTH / 2 - 1
                //           : -TILE_WIDTH - TILE_WIDTH / 2 + 1,
                //     }}
                //   />
                // }
              />

              {interactive ? (
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
              ) : null}
            </React.Fragment>
          );
        },
      ),
    [$data, $direction, position, id],
  );
};
