import React, { useMemo } from "react";
import { SpriteComponent } from "@oh/pixi-components";
import { DUMMY_FURNITURE_DATA } from "shared/consts";
import { CrossDirection } from "shared/enums";
import { FurnitureDirectionData, Point3d } from "shared/types";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {
  position?: Point3d;
};

export const FurnitureComponent: React.FC<Props> = ({ position }) => {
  const furnitureDirectionData = DUMMY_FURNITURE_DATA.direction[
    CrossDirection.NORTH
  ] as FurnitureDirectionData;

  const textures = useMemo(
    () =>
      furnitureDirectionData.textures.map(
        ({ texture, bounds, pivot, zIndex, hitArea }) => (
          <SpriteComponent
            key={texture}
            texture={texture}
            pivot={{
              x: -pivot.x - 1,
              y: -pivot.y,
            }}
            zIndex={
              position.x +
              position.z +
              Math.abs(position.y / 100) +
              zIndex +
              0.1
            }
            position={getPositionFromIsometricPosition(position)}
            spriteSheet={DUMMY_FURNITURE_DATA.spriteSheet}
          />
        ),
      ),
    [furnitureDirectionData.textures],
  );

  return <>{textures}</>;
};
