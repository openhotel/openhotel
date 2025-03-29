import React, { useMemo } from "react";
import { SpriteComponent } from "@oh/pixi-components";
import { DUMMY_FURNITURE_DATA, TILE_SIZE } from "shared/consts";
import { CrossDirection } from "shared/enums";
import { FurnitureDirectionTexture, Point3d } from "shared/types";
import { getPositionFromIsometricPosition } from "shared/utils";
import { useFurniture } from "shared/hooks";

type Props = {
  id?: string;
  furnitureId?: string;
  position: Point3d;

  direction: CrossDirection;
};

export const FurnitureComponent: React.FC<Props> = ({
  id,
  furnitureId,
  position,
  direction,
}) => {
  const { get: getFurniture } = useFurniture();

  const furnitureData = getFurniture(furnitureId);

  const textures = useMemo(
    () => furnitureData?.direction?.[direction]?.textures,
    [furnitureData, direction],
  );

  return (
    <FurnitureComponentWrapper
      position={position}
      spriteSheet={furnitureData.spriteSheet}
      textures={textures}
    />
  );
};

type PropsWrapper = {
  position: Point3d;

  spriteSheet?: string;
  textures?: FurnitureDirectionTexture[];
};

export const FurnitureComponentWrapper: React.FC<PropsWrapper> = ({
  position,
  spriteSheet = DUMMY_FURNITURE_DATA.spriteSheet,
  textures = DUMMY_FURNITURE_DATA.direction[CrossDirection.NORTH].textures,
}) => {
  const renderSprites = useMemo(
    () =>
      textures.map(({ texture, bounds, pivot, zIndex, hitArea }) => (
        <SpriteComponent
          key={texture}
          texture={texture}
          spriteSheet={spriteSheet}
          pivot={{
            x: pivot.x - 1,
            y: pivot.y + TILE_SIZE.height / 2 + 2 + bounds.height / 2,
          }}
          zIndex={
            position.x + position.z + Math.abs(position.y / 100) + zIndex + 0.1
          }
          position={getPositionFromIsometricPosition(position)}
        />
      )),
    [spriteSheet, textures],
  );

  return <>{renderSprites}</>;
};
