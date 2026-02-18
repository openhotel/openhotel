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
  DUMMY_FURNITURE_DATA,
  FURNITURE_SAFE_TILE_MARGIN,
  SAFE_Z_INDEX,
  TILE_SIZE,
  TILE_Y_HEIGHT,
} from "shared/consts";
import { CrossDirection } from "shared/enums";
import { Point3d } from "shared/types";
import { getPositionFromIsometricPosition, getZIndex } from "shared/utils";
import { useFurniture } from "shared/hooks";
import { ulid } from "ulidx";
import { getCubePolygon } from "shared/utils/polygon.utils";

type Props = {
  id?: string;

  furnitureId?: string;
  position: Point3d;

  direction?: CrossDirection;
  state?: string;

  onPointerDown?: () => void;

  disableHitArea?: boolean;
  heightCorrection?: boolean;
  isBeingPlaced?: boolean;
};

export const FurnitureComponent: React.FC<Props> = ({
  id = ulid(),
  position,
  furnitureId,
  direction = CrossDirection.NORTH,
  state,
  onPointerDown,
  disableHitArea = false,
  heightCorrection = false,
  isBeingPlaced = false,
}) => {
  const { load: loadFurniture, get: getFurniture } = useFurniture();
  const { update, lastUpdate } = useUpdate();

  useEffect(() => {
    loadFurniture(furnitureId).then(update);
  }, [furnitureId, loadFurniture, update]);

  const $data = useMemo(
    () => getFurniture(furnitureId) ?? DUMMY_FURNITURE_DATA,
    [getFurniture, furnitureId, lastUpdate],
  );
  const $direction = useMemo(
    () => (furnitureId && direction ? direction : CrossDirection.NORTH),
    [furnitureId, direction],
  );

  const $textures = useMemo(() => {
    const { textures, stateTextures } = $data.direction[$direction];
    if (!$data.actions?.length || !stateTextures) return textures;

    const action = $data.actions.find((a) => stateTextures[a.id]);
    if (!action) return textures;

    const activeState = state ?? action.defaultState;
    const activeTexture = stateTextures[action.id]?.[activeState];
    if (!activeTexture) return textures;

    return [activeTexture];
  }, [$data.direction, $data.actions, $direction, state]);

  return useMemo(
    () =>
      $textures.map(({ texture, bounds, pivot, zIndex, hitArea }) => {
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
            y: position.y / TILE_Y_HEIGHT,
          },
          0.5,
        );

        return (
          <React.Fragment key={`${id}-${texture}`}>
            <SpriteComponent
              texture={texture}
              spriteSheet={$data.spriteSheet}
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
          </React.Fragment>
        );
      }),
    [
      $data.spriteSheet,
      $textures,
      position,
      disableHitArea,
      heightCorrection,
      isBeingPlaced,
    ],
  );
};
