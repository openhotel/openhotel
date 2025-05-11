import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
  SpriteComponent,
} from "@openhotel/pixi-components";
import {
  ButtonComponent,
  FurnitureItemComponent,
  FurniturePreviewActionComponent,
  ItemListComponent,
  TextComponent,
} from "shared/components";
import { CatalogCategoryData } from "shared/types";
import { useApi, useFurniture, SoundsEnum, useSound } from "shared/hooks";
import { useTranslation } from "react-i18next";
import { FURNITURE_ICON_BOX_SIZE, SCROLL_BAR_WIDTH } from "shared/consts";
import { CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE } from "shared/consts/catalog.consts";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  categoryId: string;
  size: Size;
} & ContainerProps;

export const DefaultCategoryComponent: React.FC<Props> = ({
  categoryId,
  size,
  ...containerProps
}) => {
  const { fetch } = useApi();
  const { get } = useFurniture();
  const { play } = useSound();

  const { t } = useTranslation();
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string>(null);

  const [categoryData, setCategoryData] = useState<CatalogCategoryData>(null);

  useEffect(() => {
    setCategoryData(null);
    setSelectedFurnitureId(null);
    fetch(`/catalog?category=${categoryId}`).then(
      (category: CatalogCategoryData) => {
        setCategoryData(category);
      },
    );
  }, [fetch, categoryId, setCategoryData]);

  const items = useMemo(
    () =>
      categoryData?.furniture?.map((furniture) => {
        return {
          key: furniture.id,
          render: () => (
            <FurnitureItemComponent
              furnitureId={furniture.id}
              type={furniture.type}
            />
          ),
        };
      }),
    [categoryData],
  );

  const onSelectFurniture = useCallback(
    (furnitureId: string) => {
      setSelectedFurnitureId(furnitureId);
    },
    [setSelectedFurnitureId],
  );

  const selectedFurnitureData = useMemo(() => {
    const furniture = categoryData?.furniture.find(
      (f) => f.id === selectedFurnitureId,
    );

    return selectedFurnitureId
      ? {
          ...get(selectedFurnitureId),
          price: furniture?.price ?? 0,
        }
      : null;
  }, [get, categoryData, selectedFurnitureId]);

  const previewPositionX = useMemo(
    () =>
      CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE.cols *
        (FURNITURE_ICON_BOX_SIZE + 3) +
      SCROLL_BAR_WIDTH +
      3,
    [],
  );
  const previewWidth = useMemo(
    () => size.width - previewPositionX - 3,
    [previewPositionX],
  );

  const onBuyFurniture = useCallback(() => {
    fetch(
      "/catalog/buy",
      { furnitureId: selectedFurnitureData.furnitureId },
      false,
      "POST",
    ).then(({ transaction }) => {
      if (transaction?.success) play(SoundsEnum.BUY);
    });
  }, [fetch, selectedFurnitureData, play]);

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
          <FlexContainerComponent
            align={FLEX_ALIGN.CENTER}
            gap={2}
            size={{
              width: 20,
              height: 20 / 2,
            }}
          >
            <TextComponent
              text={selectedFurnitureData.price.toString()}
              color={0x000}
            />
            <SpriteComponent
              texture={"coin"}
              spriteSheet={SpriteSheetEnum.UI}
            />
          </FlexContainerComponent>
          <ButtonComponent
            size={{
              height: 14,
            }}
            autoWidth={true}
            text={t("economy.buy")}
            onPointerUp={onBuyFurniture}
          />
        </FlexContainerComponent>
      </FurniturePreviewActionComponent>
    );
  }, [selectedFurnitureData, previewWidth, size, onBuyFurniture]);

  const rows = useMemo(
    () =>
      Math.max(
        CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE.rows,
        (categoryData?.furniture?.length ?? 1) /
          CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE.cols,
      ),
    [categoryData],
  );

  return useMemo(
    () => (
      <ContainerComponent {...containerProps}>
        <ItemListComponent
          rows={rows}
          cols={CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE.cols}
          height={size.height}
          items={items}
          onSelect={onSelectFurniture}
        />
        <ContainerComponent position={{ x: previewPositionX }}>
          {renderPreview}
        </ContainerComponent>
      </ContainerComponent>
    ),
    [
      containerProps,
      size,
      items,
      onSelectFurniture,
      previewPositionX,
      renderPreview,
      rows,
    ],
  );
};
