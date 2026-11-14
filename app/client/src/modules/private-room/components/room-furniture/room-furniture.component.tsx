import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { FurnitureComponent } from "shared/components";
import {
  useApi,
  useFurniture,
  useItemPlacePreview,
  usePrivateRoom,
  useProxy,
  useRoom,
} from "shared/hooks";
import {
  Event as ProxyEvent,
  FurnitureType,
  PrivateRoomPreviewType,
} from "shared/enums";
import { PrivateRoom, RoomFurniture, RoomFurnitureFrame } from "shared/types";
import { FurnitureFrameComponent } from "shared/components/furniture-frame";

type Props = {
  disableHitAreas?: boolean;
};

export const RoomFurnitureComponent: React.FC<Props> = ({
  disableHitAreas = false,
}) => {
  const { on, emit } = useProxy();
  const { get: getFurniture } = useFurniture();
  const { fetch } = useApi();
  const { addFurniture, removeFurniture, updateFurniture } = usePrivateRoom();
  const { room, selectedPreview, setSelectedPreview } = useRoom<PrivateRoom>();
  const { itemPreviewData, setItemPreviewData } = useItemPlacePreview();

  const selectedPreviewRef = useRef(selectedPreview);
  useEffect(() => {
    selectedPreviewRef.current = selectedPreview;
  }, [selectedPreview]);

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
        const current = selectedPreviewRef.current;
        if (current?.id === furniture.id)
          setSelectedPreview({ ...current, state: furniture.state });
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
    (furniture: RoomFurniture) => (event: any) => {
      const data = getFurniture(furniture.furnitureId);
      if (!data) return;

      if (event.button === 1) {
        event.preventDefault();

        fetch(`/inventory?type=${furniture.type}`).then(
          (response: {
            furniture: Array<{
              id: string;
              furnitureId: string;
              type: FurnitureType;
            }>;
          }) => {
            const inventoryItems = response.furniture.filter(
              (f) => f.furnitureId === furniture.furnitureId,
            );

            if (inventoryItems.length > 0) {
              const ids = inventoryItems.map((item) => item.id);
              setItemPreviewData({
                type: "place",
                ids,
                furnitureData: data,
              });
            }
          },
        );
        return;
      }

      setSelectedPreview({
        id: furniture.id,
        type:
          furniture.type === FurnitureType.FURNITURE
            ? PrivateRoomPreviewType.FURNITURE
            : PrivateRoomPreviewType.FRAME,
        data,
        direction: furniture.direction,
        state: furniture.state,
        title:
          getFurniture(furniture.furnitureId)?.label ?? furniture.furnitureId,
      });
    },
    [setSelectedPreview, getFurniture, fetch, setItemPreviewData],
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
            state={furniture?.state}
            onPointerDown={onPointerDown(furniture)}
            disableHitArea={disableHitAreas}
            isBeingPlaced={itemPreviewData?.ids?.includes(furniture.id)}
            isForSale={!!furniture?.forSale}
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
