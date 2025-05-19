import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ItemPlacePreviewContext } from "./item-place-preview.context";
import { FurnitureData, Point3d } from "shared/types";
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

type Props = {
  children: ReactNode;
};

export const ItemPlacePreviewProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const { on } = useEvents();
  const { emit } = useProxy();

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
  const [itemPreviewData, setItemPreviewData] = useState<{
    ids: string[];
    furnitureData: FurnitureData;
  } | null>(null);

  const [$canPlace, setCanPlace] = useState<boolean>(false);

  useEffect(() => {
    if (!itemPreviewData) return;

    const removeOnPointerDown = on(Event.POINTER_DOWN, () => {
      const id = getPreviewItemId();
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
    });

    return () => {
      removeOnPointerDown();
    };
  }, [itemPreviewData, on, tilePosition, wallData]);

  useEffect(() => {
    if (!itemPreviewData) return;

    const removeOnHoverTile = on(
      InternalEvent.HOVER_TILE,
      (data: PreviewTileData) => {
        if (!data) return;

        setTilePosition(data.point);
      },
    );
    const removeOnHoverWall = on(
      InternalEvent.HOVER_WALL,
      (data: PositionData) => {
        if (!data) return;

        setWallData(data);
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

    if (furnitureData.type === FurnitureType.FURNITURE)
      return (
        <FurnitureComponent
          id={ids[0]}
          position={tilePosition}
          furnitureId={furnitureData.furnitureId}
          direction={CrossDirection.NORTH}
          hitAreaActive={false}
          heightCorrection={true}
        />
      );

    return (
      <FurnitureFrameComponent
        id={ids[0]}
        position={wallData.position}
        furnitureId={furnitureData.furnitureId}
        direction={wallData.direction}
        framePosition={wallData.wallPosition}
        interactive={false}
      />
    );
  }, [itemPreviewData, tilePosition, wallData]);

  const canPlace = useCallback(() => $canPlace, [$canPlace]);

  return (
    <ItemPlacePreviewContext.Provider
      value={{
        setItemPreviewData,
        clearItemPreviewData,
        renderPreviewItem,

        getPreviewItemId,

        setCanPlace,
        canPlace,
      }}
      children={children}
    />
  );
};
