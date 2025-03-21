import React, { useMemo } from "react";
import { SpriteComponent } from "@oh/pixi-components";
import { DUMMY_FURNITURE_DATA, TILE_SIZE } from "shared/consts";
import { CrossDirection } from "shared/enums";
import { RoomFurniture } from "shared/types";
import { getPositionFromIsometricPosition } from "shared/utils";
import { useFurniture } from "shared/hooks";

type Props = {} & RoomFurniture;

export const FurnitureComponent: React.FC<Props> = ({
  position,
  furnitureId,
}) => {
  const { get: getFurniture } = useFurniture();

  const furniture = useMemo(
    () => getFurniture(furnitureId) ?? DUMMY_FURNITURE_DATA,
    [getFurniture, furnitureId],
  );

  const furnitureDirectionData = furniture?.direction[CrossDirection.NORTH];

  const textures = useMemo(
    () =>
      furnitureDirectionData.textures.map(
        ({ texture, bounds, pivot, zIndex, hitArea }) => (
          <SpriteComponent
            key={texture}
            texture={texture}
            spriteSheet={
              furniture?.spriteSheet ?? DUMMY_FURNITURE_DATA.spriteSheet
            }
            pivot={{
              x: pivot.x - 1,
              y: pivot.y + TILE_SIZE.height / 2 + 2,
            }}
            zIndex={
              position.x +
              position.z +
              Math.abs(position.y / 100) +
              zIndex +
              0.1
            }
            position={getPositionFromIsometricPosition(position)}
          />
        ),
      ),
    [furnitureDirectionData],
  );

  return <>{textures}</>;
};
