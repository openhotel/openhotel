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
} from "shared/consts";
import { CrossDirection } from "shared/enums";
import { Point2d, Point3d } from "shared/types";
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

  interactive?: boolean;
};

export const FurnitureFrameComponent: React.FC<Props> = ({
  id = ulid(),
  position,
  framePosition,
  furnitureId,
  direction = CrossDirection.NORTH,
  onPointerDown,
  interactive = true,
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
