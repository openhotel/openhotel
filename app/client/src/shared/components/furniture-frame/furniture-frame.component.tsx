import React, { useEffect, useMemo } from "react";
import { useUpdate } from "@openhotel/pixi-components";
import { DUMMY_FURNITURE_FRAME_DATA } from "shared/consts";
import { CrossDirection } from "shared/enums";
import { Point2d, Point3d, RoomPoint } from "shared/types";
import { getZIndex } from "shared/utils";
import { useFurniture } from "shared/hooks";
import { ulid } from "ulidx";
import { FurnitureFrameTextureComponent } from "./components";

type Props = {
  id?: string;
  furnitureId?: string;
  position: Point3d;

  direction?: CrossDirection;
  framePosition: Point2d;

  onPointerDown?: () => void;

  disableHitArea?: boolean;
  roomLayout?: RoomPoint[][];
  isBeingPlaced?: boolean;
};

export const FurnitureFrameComponent: React.FC<Props> = ({
  id = ulid(),
  position,
  framePosition,
  furnitureId,
  direction = CrossDirection.NORTH,
  onPointerDown,
  disableHitArea = false,
  roomLayout,
  isBeingPlaced = false,
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
  const $zIndex = useMemo(() => getZIndex(position), [position]);

  return useMemo(
    () =>
      $data.direction[$direction].textures.map(
        ({ texture, pivot, zIndex, hitArea }) => (
          <FurnitureFrameTextureComponent
            key={id}
            texture={texture}
            spriteSheet={$data.spriteSheet}
            direction={direction}
            framePosition={framePosition}
            pivot={pivot}
            zIndex={$zIndex}
            hitArea={hitArea}
            position={position}
            size={$data.size}
            roomLayout={roomLayout}
            disableHitArea={disableHitArea}
            isBeingPlaced={isBeingPlaced}
            onPointerDown={onPointerDown}
          />
        ),
      ),
    [
      $data.direction,
      $data.spriteSheet,
      $data.size,
      $direction,
      framePosition,
      position,
      id,
      disableHitArea,
      roomLayout,
      isBeingPlaced,
      onPointerDown,
    ],
  );
};
