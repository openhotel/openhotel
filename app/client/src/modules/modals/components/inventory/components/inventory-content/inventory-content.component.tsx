import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ButtonComponent,
  FurnitureItemComponent,
  FurniturePreviewActionComponent,
  ItemListComponent,
} from "shared/components";
import { InventoryFurniture, Size2d } from "shared/types";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
} from "@openhotel/pixi-components";
import {
  useFurniture,
  useItemPlacePreview,
  useModal,
  useRouter,
} from "shared/hooks";
import {
  FURNITURE_ICON_BOX_SIZE,
  INVENTORY_DEFAULT_CATEGORY_ITEM_LIST_SIZE,
  SCROLL_BAR_WIDTH,
} from "shared/consts";
import { useTranslation } from "react-i18next";
import { Route } from "shared/enums";

type Props = {
  size: Size2d;
  furniture: InventoryFurniture[];
};

export const InventoryContentComponent: React.FC<Props> = ({
  size,
  furniture,
}) => {
  const { closeAll } = useModal();
  const { t } = useTranslation();
  const { get } = useFurniture();
  const { getRoute } = useRouter();
  const { setItemPreviewData, canPlace } = useItemPlacePreview();

  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string>(null);

  useEffect(() => {
    setSelectedFurnitureId(null);
  }, []);

  const items = useMemo(
    () =>
      furniture?.map(($furniture) => {
        return {
          key: $furniture.furnitureId,
          render: () => (
            <FurnitureItemComponent
              furnitureId={$furniture.furnitureId}
              type={$furniture.type}
              amount={$furniture.ids.length}
            />
          ),
        };
      }),
    [furniture],
  );

  const onSelectFurniture = useCallback(
    (furnitureId: string) => {
      setSelectedFurnitureId(furnitureId);
    },
    [setSelectedFurnitureId],
  );

  const selectedFurnitureData = useMemo(() => {
    return get(selectedFurnitureId);
  }, [furniture, selectedFurnitureId, get]);

  const onPlaceFurniture = useCallback(() => {
    const targetFurnitureId = furniture.find(
      (furniture) => furniture.furnitureId === selectedFurnitureId,
    ).ids;
    setItemPreviewData({
      ids: targetFurnitureId,
      furnitureData: selectedFurnitureData,
    });
    closeAll();
  }, [
    selectedFurnitureId,
    selectedFurnitureData,
    furniture,
    setItemPreviewData,
    closeAll,
  ]);

  const previewPositionX = useMemo(
    () =>
      INVENTORY_DEFAULT_CATEGORY_ITEM_LIST_SIZE.cols *
        (FURNITURE_ICON_BOX_SIZE + 3) +
      SCROLL_BAR_WIDTH +
      3,
    [],
  );

  const previewWidth = useMemo(
    () => size.width - previewPositionX,
    [previewPositionX],
  );

  const renderPreview = useMemo(() => {
    if (!selectedFurnitureData)
      return (
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          tint={0}
          width={previewWidth}
          height={size.height}
          alpha={0.2}
        />
      );

    const canPlaceItem = getRoute() === Route.PRIVATE_ROOM && canPlace();

    return (
      <FurniturePreviewActionComponent
        furniture={selectedFurnitureData}
        size={{ width: previewWidth, height: size.height }}
      >
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.END}
          align={FLEX_ALIGN.CENTER}
          gap={6}
          size={{
            width: previewWidth - 3,
            height: 20,
          }}
        >
          {canPlaceItem ? (
            <ButtonComponent
              autoWidth={true}
              text={t("inventory.place")}
              onPointerUp={onPlaceFurniture}
            />
          ) : null}
        </FlexContainerComponent>
      </FurniturePreviewActionComponent>
    );
  }, [
    selectedFurnitureData,
    previewWidth,
    size,
    t,
    getRoute,
    onPlaceFurniture,
    canPlace,
  ]);

  return (
    <>
      <ItemListComponent
        rows={INVENTORY_DEFAULT_CATEGORY_ITEM_LIST_SIZE.rows}
        cols={INVENTORY_DEFAULT_CATEGORY_ITEM_LIST_SIZE.cols}
        height={size.height}
        items={items}
        onSelect={onSelectFurniture}
      />
      <ContainerComponent
        position={{
          x: previewPositionX,
        }}
      >
        {renderPreview}
      </ContainerComponent>
    </>
  );
};
