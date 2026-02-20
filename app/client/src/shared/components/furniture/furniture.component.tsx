import React, { useEffect, useMemo } from "react";
import { useUpdate } from "@openhotel/pixi-components";
import { DUMMY_FURNITURE_DATA } from "shared/consts";
import { CrossDirection } from "shared/enums";
import { Point3d } from "shared/types";
import { useFurniture } from "shared/hooks";
import { ulid } from "ulidx";
import { FurnitureTextureComponent } from "./components";

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
    const { textures } = $data.direction[$direction];
    if (!$data.actions?.length) return textures;

    //TODO >> Actions
    const action1 = $data.actions[0];
    return textures.filter(
      (texture) =>
        texture.actions?.[action1.id] === (state ?? action1.defaultState),
    );
  }, [$data.direction, $data.actions, $direction, state]);

  return useMemo(
    () =>
      $textures.map(({ texture, pivot, zIndex, hitArea }) => (
        <FurnitureTextureComponent
          key={`${id}-${texture}`}
          texture={texture}
          spriteSheet={$data.spriteSheet}
          pivot={pivot}
          zIndex={zIndex}
          hitArea={hitArea}
          position={position}
          size={$data.size}
          disableHitArea={disableHitArea}
          isBeingPlaced={isBeingPlaced}
          heightCorrection={heightCorrection}
          onPointerDown={onPointerDown}
        />
      )),
    [
      $data.spriteSheet,
      $data.size,
      $textures,
      position,
      disableHitArea,
      heightCorrection,
      isBeingPlaced,
      onPointerDown,
    ],
  );
};
