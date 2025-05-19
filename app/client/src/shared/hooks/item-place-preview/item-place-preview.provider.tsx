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
import { CrossDirection, FurnitureType, InternalEvent } from "shared/enums";

type Props = {
  children: ReactNode;
};

export const ItemPlacePreviewProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const { on } = useEvents();

  const [position, setPosition] = useState<Point3d>({ x: 0, y: 0, z: 0 });
  const [itemPreviewData, setItemPreviewData] = useState<{
    ids: string[];
    furnitureData: FurnitureData;
  } | null>(null);

  const [$canPlace, setCanPlace] = useState<boolean>(false);

  useEffect(() => {
    const removeOnHoverTile = on(
      InternalEvent.HOVER_TILE,
      (data: PreviewTileData) => {
        if (!data) return;

        setPosition(data.point);
      },
    );

    if (!itemPreviewData) return;

    const removeOnKeyDown = on(Event.KEY_DOWN, ({ code }: KeyboardEvent) => {
      if (code === "Escape") {
        setItemPreviewData(null);
      }
    });

    return () => {
      removeOnHoverTile?.();
      removeOnKeyDown?.();
    };
  }, [itemPreviewData, on, setPosition, setItemPreviewData]);

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

    return furnitureData.type === FurnitureType.FURNITURE ? (
      <FurnitureComponent
        id={ids[0]}
        position={position}
        furnitureId={furnitureData.furnitureId}
        direction={CrossDirection.NORTH}
        hitAreaActive={false}
        heightCorrection={true}
      />
    ) : (
      <FurnitureFrameComponent
        id={ids[0]}
        position={position}
        furnitureId={furnitureData.furnitureId}
        direction={CrossDirection.NORTH}
        framePosition={{ x: 0, y: 0 }}
      />
    );
  }, [itemPreviewData, position]);

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
