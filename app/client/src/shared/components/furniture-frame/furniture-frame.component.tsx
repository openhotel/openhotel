import React, { useMemo } from "react";
import { SpriteComponent } from "@oh/pixi-components";
import { DUMMY_FURNITURE_FRAME_DATA } from "shared/consts";
import { CrossDirection } from "shared/enums";
import { FurnitureDirectionTexture, Point2d, Point3d } from "shared/types";
import { getPositionFromIsometricPosition } from "shared/utils";
import { useFurniture } from "shared/hooks";
import { FurnitureComponentWrapper } from "shared/components/furniture";
import { getWallPositionFromIsometricPosition } from "shared/utils/wall.utils";

type Props = {
  id?: string;
  furnitureId?: string;
  position: Point3d;

  direction: CrossDirection;
};

export const FurnitureFrameComponent: React.FC<Props> = ({
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
  framePosition: Point2d;
  direction?: CrossDirection;

  spriteSheet?: string;
  textures?: FurnitureDirectionTexture[];
};

export const FurnitureFrameComponentWrapper: React.FC<PropsWrapper> = ({
  position,
  framePosition,
  direction = CrossDirection.NORTH,
  spriteSheet = DUMMY_FURNITURE_FRAME_DATA.spriteSheet,
  textures,
}) => {
  let $textures = useMemo(
    () => textures ?? DUMMY_FURNITURE_FRAME_DATA.direction[direction].textures,
    [direction, textures],
  );

  const renderSprites = useMemo(
    () =>
      $textures.map(({ texture, bounds, pivot, zIndex, hitArea }) => {
        const pos = getWallPositionFromIsometricPosition(framePosition);
        const $position = getPositionFromIsometricPosition({
          x: position.x,
          y: position.y,
          z: position.z,
        });

        return (
          <SpriteComponent
            key={texture}
            texture={texture}
            spriteSheet={spriteSheet}
            pivot={{
              //TODO <<<<<<<<<<<<<<<<<<<
              x: pivot.x - 1 - bounds.width,
              y: pivot.y / 2 - 2,
            }}
            zIndex={
              position.x +
              position.z +
              Math.abs(position.y / 100) +
              zIndex +
              0.1
            }
            position={{
              x: $position.x + pos.x,
              y: $position.y + pos.y,
            }}
          />
        );
      }),
    [spriteSheet, $textures],
  );

  return <>{renderSprites}</>;
};
