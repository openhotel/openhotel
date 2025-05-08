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
  FurniturePreviewComponent,
  ItemListComponent,
  SoftBadgeComponent,
  TextComponent,
} from "shared/components";
import { CatalogCategoryData } from "shared/types";
import { useApi, useFurniture } from "shared/hooks";
import { useTranslation } from "react-i18next";
import {
  FURNITURE_ICON_BOX_SIZE,
  FURNITURE_ICON_SIZE,
  SCROLL_BAR_WIDTH,
} from "shared/consts";
import { CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE } from "shared/consts/catalog.consts";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  categoryId: string;
  size: Size;
} & ContainerProps;

const bottomHeight = 20;

export const DefaultCategoryComponent: React.FC<Props> = ({
  categoryId,
  size,
  ...containerProps
}) => {
  const { fetch } = useApi();
  const { load, get } = useFurniture();

  const { t } = useTranslation();
  const [selectedFurniture, setSelectedFurniture] = useState<string>(null);

  const [categoryData, setCategoryData] = useState<CatalogCategoryData>(null);

  useEffect(() => {
    setCategoryData(null);
    setSelectedFurniture(null);
    fetch(`/catalog?category=${categoryId}`).then(
      (category: CatalogCategoryData) => {
        load(...category.furniture.map((furniture) => furniture.id));
        setCategoryData(category);
      },
    );
  }, [fetch, categoryId, setCategoryData]);

  const items = useMemo(
    () =>
      categoryData?.furniture?.map((furniture) => {
        const data = furniture ? get(furniture.id) : null;
        return {
          key: furniture.id,
          render: () =>
            data ? (
              <SpriteComponent
                texture={data.icon.texture}
                spriteSheet={data.spriteSheet}
                pivot={{
                  x: (data.icon.bounds.width - FURNITURE_ICON_SIZE) / 2,
                  y: (data.icon.bounds.height - FURNITURE_ICON_SIZE) / 2,
                }}
              />
            ) : null,
        };
      }),
    [categoryData, get],
  );

  const onSelectFurniture = useCallback(
    (furnitureId: string) => {
      setSelectedFurniture(furnitureId);
    },
    [setSelectedFurniture],
  );

  const selectedFurnitureData = useMemo(() => {
    const furniture = categoryData?.furniture.find(
      (f) => f.id === selectedFurniture,
    );

    return selectedFurniture
      ? {
          ...get(selectedFurniture),
          price: furniture?.price ?? 0,
        }
      : null;
  }, [get, categoryData, selectedFurniture]);

  const previewPositionX = useMemo(
    () =>
      CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE.cols *
        (FURNITURE_ICON_BOX_SIZE + 2) +
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
    ).then((r) => {
      console.log(r);
    });
  }, [fetch, selectedFurnitureData]);

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

    const height = size.height - bottomHeight;
    return (
      <>
        <ContainerComponent position={{ x: 5 }}>
          <FurniturePreviewComponent
            furnitureData={selectedFurnitureData}
            size={{
              width: previewWidth - 10,
              height: height - 3 - 9 * 3 - 3,
            }}
          />
          <TextComponent
            position={{
              y: height - 9 * 3 - 3,
            }}
            bold
            color={0}
            text={
              selectedFurnitureData.label ?? selectedFurnitureData.furnitureId
            }
          />
          <TextComponent
            position={{
              y: height - 8 * 2 - 3,
            }}
            color={0}
            maxWidth={previewWidth - 10}
            text={
              selectedFurnitureData.description ??
              "This is a test for a description an"
            }
          />
        </ContainerComponent>
        <ContainerComponent position={{ y: height }}>
          <SoftBadgeComponent
            size={{
              width: previewWidth,
              height: bottomHeight,
            }}
          />
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.END}
            align={FLEX_ALIGN.CENTER}
            gap={6}
            size={{
              width: previewWidth - 3,
              height: bottomHeight,
            }}
          >
            <FlexContainerComponent
              align={FLEX_ALIGN.CENTER}
              gap={2}
              size={{
                width: 20,
                height: bottomHeight / 2,
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
        </ContainerComponent>
      </>
    );
  }, [selectedFurnitureData, previewWidth, bottomHeight, size, onBuyFurniture]);

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
        <ContainerComponent position={{ x: previewPositionX + 3 }}>
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
