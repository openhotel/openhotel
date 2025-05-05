import React, { useMemo } from "react";
import {
  Cursor,
  EventMode,
  GraphicsComponent,
  GraphicType,
  SpriteComponent,
} from "@openhotel/pixi-components";
import {
  DUMMY_FURNITURE_DATA,
  FURNITURE_SAFE_TILE_MARGIN,
  SAFE_Z_INDEX,
  TILE_SIZE,
} from "shared/consts";
import { CrossDirection } from "shared/enums";
import { FurnitureData, Point3d } from "shared/types";
import { getPositionFromIsometricPosition } from "shared/utils";
import { useFurniture } from "shared/hooks";
import { ulid } from "ulidx";
import { getCubePolygon } from "shared/utils/polygon.utils";

type Props = {
  id: string;

  furnitureId?: string;
  position: Point3d;

  direction: CrossDirection;

  onPointerDown?: () => void;
};

export const FurnitureComponent: React.FC<Props> = ({
  id,
  furnitureId,
  position,
  direction,
  onPointerDown,
}) => {
  const { get: getFurniture } = useFurniture();

  const furnitureData = getFurniture(furnitureId);

  return (
    <FurnitureComponentWrapper
      id={id}
      position={position}
      data={furnitureData}
      direction={direction}
      onPointerDown={onPointerDown}
    />
  );
};

type PropsWrapper = {
  id?: string;
  position: Point3d;

  data?: FurnitureData;
  direction?: CrossDirection;

  onPointerDown?: () => void;
};

export const FurnitureComponentWrapper: React.FC<PropsWrapper> = ({
  id = ulid(),
  position,
  data = DUMMY_FURNITURE_DATA,
  direction = CrossDirection.NORTH,
  onPointerDown,
}) => {
  const $data = useMemo(() => (data ? data : DUMMY_FURNITURE_DATA), [data]);
  const $direction = useMemo(
    () => (data && direction ? direction : CrossDirection.NORTH),
    [data, direction],
  );

  return useMemo(
    () =>
      $data.direction[$direction].textures.map(
        ({ texture, bounds, pivot, zIndex, hitArea }) => {
          const $position = getPositionFromIsometricPosition(position, false);
          const $pivot = {
            x: bounds.width / 2 - pivot.x - TILE_SIZE.width / 2 - 1,
            y: bounds.height - pivot.y - TILE_SIZE.height / 2,
          };
          const $size = $data.size ?? DUMMY_FURNITURE_DATA.size;
          const $zIndex =
            position.x + position.z + position.y / 50 + zIndex + 0.5;

          return (
            <React.Fragment key={id}>
              <SpriteComponent
                texture={texture}
                spriteSheet={$data.spriteSheet}
                pivot={$pivot}
                zIndex={$zIndex}
                position={$position}
              />

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
            </React.Fragment>
          );
        },
      ),
    [$data.spriteSheet, $data.direction, $direction],
  );
};
