import React, { useCallback, useEffect, useMemo } from "react";
import { FurnitureComponent } from "shared/components";
import { useFurniture, usePrivateRoom, useProxy } from "shared/hooks";
import {
  Event as ProxyEvent,
  FurnitureType,
  PrivateRoomPreviewType,
} from "shared/enums";
import { RoomFurniture, RoomFurnitureFrame } from "shared/types";
import { FurnitureFrameComponent } from "shared/components/furniture-frame";

export const RoomFurnitureComponent: React.FC = () => {
  const { on, emit } = useProxy();
  const { get: getFurniture } = useFurniture();
  const {
    room,
    addFurniture,
    removeFurniture,
    updateFurniture,
    setSelectedPreview,
  } = usePrivateRoom();

  useEffect(() => {
    if (!room) return;

    const removeOnAddFurniture = on(
      ProxyEvent.ADD_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture }) => {
        addFurniture(furniture);
      },
    );

    const removeOnUpdateFurniture = on(
      ProxyEvent.REMOVE_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture }) => {
        removeFurniture(furniture);
      },
    );

    const removeOnRemoveFurniture = on(
      ProxyEvent.REMOVE_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture }) => {
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
          />
        ),
      ),
    [room?.furniture],
  );
};
