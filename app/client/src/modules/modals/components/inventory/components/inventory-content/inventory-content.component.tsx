import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ButtonComponent,
  FurnitureItemComponent,
  FurniturePreviewActionComponent,
  ItemListComponent,
  TextComponent,
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
  useApi,
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
import { Modal, Route } from "shared/enums";

type Props = {
  size: Size2d;
  furniture: InventoryFurniture[];
  onRefresh?: () => void;
};

export const InventoryContentComponent: React.FC<Props> = ({
  size,
  furniture,
  onRefresh,
}) => {
  const { closeAll, openModal } = useModal();
  const { t } = useTranslation();
  const { get } = useFurniture();
  const { getRoute } = useRouter();
  const { setItemPreviewData, canPlace } = useItemPlacePreview();
  const { fetch } = useApi();

  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string>(null);

  useEffect(() => {
    setSelectedFurnitureId(null);
  }, []);

  const selectedFurnitureItem = useMemo(() => {
    return furniture?.find((f) => f.furnitureId === selectedFurnitureId);
  }, [furniture, selectedFurnitureId]);

  const hasItemsOnSale = useMemo(() => {
    if (!selectedFurnitureItem?.marketplaceListingIds) return false;
    return Object.keys(selectedFurnitureItem.marketplaceListingIds).length > 0;
  }, [selectedFurnitureItem]);

  const availableForSaleCount = useMemo(() => {
    if (!selectedFurnitureItem) return 0;
    const totalCount = selectedFurnitureItem.ids.length;
    const listedCount = selectedFurnitureItem.marketplaceListingIds
      ? Object.keys(selectedFurnitureItem.marketplaceListingIds).length
      : 0;
    return totalCount - listedCount;
  }, [selectedFurnitureItem]);

  const getFirstAvailableId = useCallback(() => {
    if (!selectedFurnitureItem) return null;
    const listedIds = selectedFurnitureItem.marketplaceListingIds
      ? Object.keys(selectedFurnitureItem.marketplaceListingIds)
      : [];

    return selectedFurnitureItem.ids.find((id) => !listedIds.includes(id));
  }, [selectedFurnitureItem]);

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
      type: "place",
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

  const onOpenSellModal = useCallback(() => {
    if (!selectedFurnitureId) return;

    const instanceId = getFirstAvailableId();
    if (!instanceId) return;

    openModal(Modal.MARKETPLACE_SELL, {
      furnitureId: selectedFurnitureId,
      instanceId,
      onSuccess: onRefresh,
    });
  }, [selectedFurnitureId, getFirstAvailableId, openModal, onRefresh]);

  const onCancelListing = useCallback(() => {
    if (!selectedFurnitureItem?.marketplaceListingIds) return;

    const listingId = Object.values(
      selectedFurnitureItem.marketplaceListingIds,
    )[0];
    if (!listingId) return;

    fetch("/marketplace/cancel", { listingId }, false, "POST").then(
      (result) => {
        if (result.success) {
          onRefresh?.();
        }
      },
    );
  }, [selectedFurnitureItem, fetch, onRefresh]);

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
          {hasItemsOnSale ? (
            <FlexContainerComponent
              align={FLEX_ALIGN.CENTER}
              gap={4}
              size={{ width: previewWidth - 6, height: 14 }}
            >
              <TextComponent text={t("marketplace.on_sale")} color={0xaa6600} />
              <ButtonComponent
                autoWidth={true}
                text={t("marketplace.cancel_sale")}
                onPointerUp={onCancelListing}
                size={{
                  width: 80,
                  height: 14,
                }}
              />
            </FlexContainerComponent>
          ) : null}
          {availableForSaleCount > 0 ? (
            <ButtonComponent
              autoWidth={true}
              text={t("marketplace.sell")}
              onPointerUp={onOpenSellModal}
            />
          ) : null}
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
    onOpenSellModal,
    hasItemsOnSale,
    availableForSaleCount,
    onCancelListing,
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
