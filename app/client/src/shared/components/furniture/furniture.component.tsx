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
  TILE_Y_HEIGHT,
} from "shared/consts";
import { CrossDirection } from "shared/enums";
import { FurnitureData, Point3d } from "shared/types";
import { getPositionFromIsometricPosition, getZIndex } from "shared/utils";
import { useFurniture } from "shared/hooks";
import { ulid } from "ulidx";
import { getCubePolygon } from "shared/utils/polygon.utils";

type Props = {
  id: string;

  furnitureId?: string;
  position: Point3d;

  direction: CrossDirection;

  onPointerDown?: () => void;

  hitAreaActive?: boolean;
  heightCorrection?: boolean;
};

export const FurnitureComponent: React.FC<Props> = ({
  id,
  furnitureId,
  position,
  direction,
  onPointerDown,
  hitAreaActive = true,
  heightCorrection = false,
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
      hitAreaActive={hitAreaActive}
      heightCorrection={heightCorrection}
    />
  );
};

type PropsWrapper = {
  id?: string;
  position: Point3d;

  data?: FurnitureData;
  direction?: CrossDirection;

  onPointerDown?: () => void;

  hitAreaActive?: boolean;
  heightCorrection?: boolean;
};

export const FurnitureComponentWrapper: React.FC<PropsWrapper> = ({
  id = ulid(),
  position,
  data = DUMMY_FURNITURE_DATA,
  direction = CrossDirection.NORTH,
  onPointerDown,
  hitAreaActive = true,
  heightCorrection = false,
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
          const $position = getPositionFromIsometricPosition(
            position,
            heightCorrection,
          );
          const $pivot = {
            x: bounds.width / 2 - pivot.x - TILE_SIZE.width / 2 - 1,
            y: bounds.height - pivot.y - TILE_SIZE.height / 2,
          };
          const $size = $data.size ?? DUMMY_FURNITURE_DATA.size;
          const $zIndex = getZIndex(
            {
              ...position,
              y: Math.round(position.y / TILE_Y_HEIGHT),
            },
            0.5,
          );

          return (
            <React.Fragment key={id}>
              <SpriteComponent
                texture={texture}
                spriteSheet={$data.spriteSheet}
                pivot={$pivot}
                zIndex={$zIndex}
                position={$position}
              />

              {hitAreaActive ? (
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
              ) : null}
            </React.Fragment>
          );
        },
      ),
    [
      $data.spriteSheet,
      $data.direction,
      $direction,
      position,
      hitAreaActive,
      heightCorrection,
    ],
  );
};
