import React, { useMemo } from "react";
import { SpriteComponent } from "@oh/pixi-components";
import { DUMMY_FURNITURE_DATA, TILE_SIZE } from "shared/consts";
import { CrossDirection } from "shared/enums";
import { FurnitureDirectionTexture, Point3d } from "shared/types";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {
  id?: string;
  furnitureId?: string;
  position: Point3d;

  spriteSheet?: string;
  textures?: FurnitureDirectionTexture[];
};

export const FurnitureComponent: React.FC<Props> = ({
  id,
  furnitureId,
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
            y: pivot.y + TILE_SIZE.height / 2 + 2,
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
