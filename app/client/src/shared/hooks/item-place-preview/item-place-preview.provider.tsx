import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ItemPlacePreviewContext,
  ItemPreviewData,
} from "./item-place-preview.context";
import { Point3d, PrivateRoom } from "shared/types";
import {
  FurnitureComponent,
  FurnitureFrameComponent,
  PreviewTileData,
} from "shared/components";
import { Event, useEvents } from "@openhotel/pixi-components";
import {
  CrossDirection,
  Event as ProxyEvent,
  FurnitureType,
  InternalEvent,
} from "shared/enums";
import { PositionData } from "shared/hooks/private-room";
import { useProxy } from "shared/hooks/proxy";
import { isPosition3dEqual } from "shared/utils";
import { useFurniture } from "shared/hooks/furniture";

type Props = {
  children: ReactNode;
};

export const ItemPlacePreviewProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const { on } = useEvents();
  const { emit } = useProxy();
  const { get } = useFurniture();

  const [tilePosition, setTilePosition] = useState<Point3d>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [wallData, setWallData] = useState<PositionData>({
    position: { x: 0, y: 0, z: 0 },
    wallPosition: { x: 0, y: 0 },
    direction: CrossDirection.NORTH,
  });
  const [itemPreviewData, setItemPreviewData] =
    useState<ItemPreviewData | null>(null);
  const [privateRoom, setPrivateRoom] = useState<PrivateRoom | null>(null);

  const [$canPlace, setCanPlace] = useState<boolean>(false);

  useEffect(() => {
    if (!itemPreviewData) return;

    const removeOnPointerDown = on(Event.POINTER_DOWN, () => {
      if (
        itemPreviewData.furnitureData.type === FurnitureType.FURNITURE
          ? !tilePosition
          : !wallData
      )
        return setItemPreviewData(null);

      const id = getPreviewItemId();

      switch (itemPreviewData.type) {
        case "place":
          emit(
            ProxyEvent.PLACE_ITEM,
            itemPreviewData.furnitureData.type === FurnitureType.FURNITURE
              ? {
                  position: tilePosition,
                  id,
                }
              : {
                  id,
                  position: wallData.position,
                  framePosition: wallData.wallPosition,
                  direction: wallData.direction,
                },
          );
          break;
        case "move":
          emit(
            ProxyEvent.MOVE_FURNITURE,
            itemPreviewData.furnitureData.type === FurnitureType.FURNITURE
              ? {
                  position: tilePosition,
                  id,
                }
              : {
                  id,
                  position: wallData.position,
                  framePosition: wallData.wallPosition,
                  direction: wallData.direction,
                },
          );
          break;
      }
    });

    return () => {
      removeOnPointerDown();
    };
  }, [itemPreviewData, on, tilePosition, wallData, setItemPreviewData]);

  useEffect(() => {
    if (!itemPreviewData) return;

    const removeOnHoverTile = on(
      InternalEvent.HOVER_TILE,
      (data: PreviewTileData) => {
        setTilePosition(data?.point ?? null);
      },
    );
    const removeOnHoverWall = on(
      InternalEvent.HOVER_WALL,
      (data: PositionData) => {
        setWallData(data ?? null);
      },
    );

    let removeOnKeyDown = null;

    if (itemPreviewData)
      removeOnKeyDown = on(Event.KEY_DOWN, ({ code }: KeyboardEvent) => {
        if (code === "Escape") {
          setItemPreviewData(null);
        }
      });

    return () => {
      removeOnHoverTile?.();
      removeOnHoverWall?.();
      removeOnKeyDown?.();
    };
  }, [itemPreviewData, on, setWallData, setItemPreviewData, setTilePosition]);

  const clearItemPreviewData = useCallback(
    () => setItemPreviewData(null),
    [setItemPreviewData],
  );

  const getPreviewItemId = useCallback(() => {
    let targetId = null;
    setItemPreviewData((data) => {
      if (!data) return data;

      targetId = data?.ids?.shift();
      if (!targetId || !data.ids.length) return null;

      return data;
    });
    return targetId;
  }, [setItemPreviewData]);

  const renderPreviewItem = useMemo(() => {
    if (!itemPreviewData) return null;

    const { ids, furnitureData } = itemPreviewData;

    if (furnitureData.type === FurnitureType.FURNITURE) {
      if (!tilePosition) return null;

      const positionY = privateRoom?.furniture
        ?.filter(
          (furniture) =>
            furniture.type === FurnitureType.FURNITURE &&
            isPosition3dEqual(furniture.position, tilePosition),
        )
        .reduce(
          (y, furniture) =>
            Math.max(
              y,
              furniture.position.y +
                (get(furniture.furnitureId)?.size?.height ?? 0),
            ),
          0,
        );
      tilePosition.y = positionY;
      return (
        <FurnitureComponent
          id={ids[0]}
          position={tilePosition}
          furnitureId={furnitureData.furnitureId}
          direction={CrossDirection.NORTH}
          disableHitArea={true}
          heightCorrection={false}
        />
      );
    }

    return wallData ? (
      <FurnitureFrameComponent
        id={ids[0]}
        position={wallData.position}
        furnitureId={furnitureData.furnitureId}
        direction={wallData.direction}
        framePosition={wallData.wallPosition}
        disableHitArea={true}
      />
    ) : null;
  }, [itemPreviewData, tilePosition, wallData, privateRoom, get]);

  const canPlace = useCallback(() => $canPlace, [$canPlace]);

  return (
    <ItemPlacePreviewContext.Provider
      value={{
        setItemPreviewData,
        clearItemPreviewData,
        renderPreviewItem,
        itemPreviewData,

        getPreviewItemId,

        setCanPlace,
        canPlace,

        setPrivateRoom,
      }}
      children={children}
    />
  );
};
