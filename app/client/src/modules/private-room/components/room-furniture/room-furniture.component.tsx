import React, { useCallback, useEffect, useMemo } from "react";
import { FurnitureComponent } from "shared/components";
import {
  useFurniture,
  useItemPlacePreview,
  usePrivateRoom,
  useProxy,
} from "shared/hooks";
import {
  Event as ProxyEvent,
  FurnitureType,
  PrivateRoomPreviewType,
} from "shared/enums";
import { RoomFurniture, RoomFurnitureFrame } from "shared/types";
import { FurnitureFrameComponent } from "shared/components/furniture-frame";

type Props = {
  disableHitAreas?: boolean;
};

export const RoomFurnitureComponent: React.FC<Props> = ({
  disableHitAreas = false,
}) => {
  const { on, emit } = useProxy();
  const { get: getFurniture } = useFurniture();
  const {
    room,
    addFurniture,
    removeFurniture,
    updateFurniture,
    setSelectedPreview,
  } = usePrivateRoom();
  const { itemPreviewData } = useItemPlacePreview();

  useEffect(() => {
    if (!room) return;

    const removeOnAddFurniture = on(
      ProxyEvent.ADD_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture }) => {
        addFurniture(furniture);
      },
    );

    const removeOnUpdateFurniture = on(
      ProxyEvent.UPDATE_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture }) => {
        updateFurniture(furniture);
      },
    );

    const removeOnRemoveFurniture = on(
      ProxyEvent.REMOVE_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture | RoomFurniture[] }) => {
        removeFurniture(furniture);
      },
    );

    return () => {
      removeOnAddFurniture();
      removeOnUpdateFurniture();
      removeOnRemoveFurniture();
    };
  }, [room, on, emit, addFurniture, updateFurniture, removeFurniture]);

  const onPointerDown = useCallback(
    (furniture: RoomFurniture) => () => {
      const data = getFurniture(furniture.furnitureId);
      if (!data) return;

      setSelectedPreview({
        id: furniture.id,
        type:
          furniture.type === FurnitureType.FURNITURE
            ? PrivateRoomPreviewType.FURNITURE
            : PrivateRoomPreviewType.FRAME,
        data,
        direction: furniture.direction,
        title:
          getFurniture(furniture.furnitureId)?.label ?? furniture.furnitureId,
      });
    },
    [setSelectedPreview, getFurniture],
  );

  if (!room?.furniture) return null;

  return useMemo(
    () =>
      room?.furniture?.map((furniture) =>
        furniture.type === FurnitureType.FURNITURE ? (
          <FurnitureComponent
            key={furniture.id}
            id={furniture.id}
            position={furniture.position}
            furnitureId={furniture.furnitureId}
            direction={furniture?.direction}
            onPointerDown={onPointerDown(furniture)}
            disableHitArea={disableHitAreas}
            isBeingPlaced={itemPreviewData?.ids?.includes(furniture.id)}
          />
        ) : (
          <FurnitureFrameComponent
            key={furniture.id}
            id={furniture.id}
            position={furniture.position}
            furnitureId={furniture.furnitureId}
            direction={furniture?.direction}
            framePosition={(furniture as RoomFurnitureFrame)?.framePosition}
            onPointerDown={onPointerDown(furniture)}
            disableHitArea={disableHitAreas}
            roomLayout={room?.layout}
            isBeingPlaced={itemPreviewData?.ids?.includes(furniture.id)}
          />
        ),
      ),
    [room?.furniture, disableHitAreas, room?.layout, itemPreviewData],
  );
};
