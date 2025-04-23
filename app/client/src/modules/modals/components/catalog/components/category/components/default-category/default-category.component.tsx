import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  NineSliceSpriteComponent,
  Size,
  SpriteComponent,
} from "@openhotel/pixi-components";
import {
  FurniturePreviewComponent,
  ItemListComponent,
  TextComponent,
} from "shared/components";
import { SpriteSheetEnum } from "shared/enums";
import { CatalogCategoryData } from "shared/types";
import { useApi, useFurniture } from "shared/hooks";
import {
  FURNITURE_ICON_BOX_SIZE,
  FURNITURE_ICON_SIZE,
  SCROLL_BAR_WIDTH,
} from "shared/consts";
import { CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE } from "shared/consts/catalog.consts";

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
  const { load, get } = useFurniture();

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

  const selectedFurnitureData = useMemo(
    () => (selectedFurniture ? get(selectedFurniture) : null),
    [get, selectedFurniture],
  );

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

  const bottomHeight = 20;

  const renderPreview = useMemo(() => {
    if (!selectedFurnitureData)
      return (
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          tint={0xff00ff}
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
          <NineSliceSpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="background-circle-x6"
            leftWidth={2}
            rightWidth={2}
            topHeight={2}
            bottomHeight={2}
            width={previewWidth}
            height={bottomHeight}
            tint={0xe0e0e0}
          />
          <ContainerComponent
            position={{
              x: previewWidth - 37 - 3,
              y: 3,
            }}
          >
            <NineSliceSpriteComponent
              spriteSheet={SpriteSheetEnum.UI}
              texture="ui-button"
              leftWidth={3}
              rightWidth={3}
              topHeight={3}
              bottomHeight={3}
              width={37}
              height={14}
              eventMode={EventMode.STATIC}
              cursor={Cursor.POINTER}
            />
            <FlexContainerComponent
              size={{ width: 37, height: 14 }}
              justify={FLEX_JUSTIFY.CENTER}
              align={FLEX_ALIGN.CENTER}
            >
              <TextComponent text="Buy" color={0} />
            </FlexContainerComponent>
          </ContainerComponent>
        </ContainerComponent>
      </>
    );
  }, [selectedFurnitureData, previewWidth, bottomHeight, size]);

  return (
    <ContainerComponent {...containerProps}>
      <ItemListComponent
        rows={Math.max(
          CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE.rows,
          (categoryData?.furniture?.length ?? 1) /
            CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE.cols,
        )}
        cols={CATALOG_DEFAULT_CATEGORY_ITEM_LIST_SIZE.cols}
        height={size.height}
        items={items}
        onSelect={onSelectFurniture}
      />
      <ContainerComponent position={{ x: previewPositionX + 3 }}>
        {renderPreview}
      </ContainerComponent>
    </ContainerComponent>
  );
};
