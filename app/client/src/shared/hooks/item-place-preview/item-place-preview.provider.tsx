import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ItemPlacePreviewContext } from "./item-place-preview.context";
import {
  FurnitureData,
  Point2d,
  Point3d,
  RoomFurnitureFrame,
} from "shared/types";
import {
  FurnitureComponent,
  FurnitureFrameComponent,
  PreviewTileData,
} from "shared/components";
import { useEvents } from "@openhotel/pixi-components";
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
    id: string;
    furnitureData: FurnitureData;
  } | null>(null);

  const [$canPlace, setCanPlace] = useState<boolean>(false);

  useEffect(() => {
    if (!itemPreviewData) return;

    const removeOnHoverTile = on(
      InternalEvent.HOVER_TILE,
      (data: PreviewTileData) => {
        if (!data) return;

        setPosition(data.point);
      },
    );

    return () => {
      removeOnHoverTile?.();
    };
  }, [itemPreviewData, on, setPosition]);

  const clearItemPreviewData = useCallback(
    () => setItemPreviewData(null),
    [setItemPreviewData],
  );

  const renderPreviewItem = useMemo(() => {
    if (!itemPreviewData) return null;

    const { id, furnitureData } = itemPreviewData;

    console.log(position);
    return furnitureData.type === FurnitureType.FURNITURE ? (
      <FurnitureComponent
        id={id}
        position={position}
        furnitureId={furnitureData.furnitureId}
        direction={CrossDirection.NORTH}
        hitAreaActive={false}
        heightCorrection={true}
      />
    ) : (
      <FurnitureFrameComponent
        id={id}
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

        setCanPlace,
        canPlace,
      }}
      children={children}
    />
  );
};
