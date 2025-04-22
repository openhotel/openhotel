import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CatalogCategoryData, Size2d } from "shared/types";
import {
  ContainerComponent,
  ContainerProps,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  NineSliceSpriteComponent,
  SpriteComponent,
} from "@openhotel/pixi-components";
import {
  FurnitureComponentWrapper,
  ItemListComponent,
  TextComponent,
} from "shared/components";
import { useApi, useFurniture } from "shared/hooks";
import { CrossDirection, FurnitureType, SpriteSheetEnum } from "shared/enums";
import { FurnitureFrameComponentWrapper } from "shared/components/furniture-frame";
import {
  PrivateRoomTile,
  PrivateRoomWallComponent,
} from "shared/components/private-room/components";

type Props = {
  size: Size2d;
  categoryId: string;
} & ContainerProps;

const HEADER_SIZE = 40;
const FURNITURE_ICON_SIZE = 24;

export const CategoryComponent: React.FC<Props> = ({
  size,
  categoryId,
  ...containerProps
}) => {
  const { fetch } = useApi();
  const { load, get } = useFurniture();

  const [categoryData, setCategoryData] = useState<CatalogCategoryData>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<string>(null);

  useEffect(() => {
    setCategoryData(null);
    fetch(`/catalog?category=${categoryId}`).then(
      (category: CatalogCategoryData) => {
        load(...category.furniture.map((furniture) => furniture.id));
        setCategoryData(category);
        setSelectedFurniture(null);
      },
    );
  }, [fetch, categoryId, setCategoryData]);

  const itemsContainerSize = {
    width: (FURNITURE_ICON_SIZE + 3) * 3,
    height: size.height - HEADER_SIZE - 5,
  };

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
                  x: (data.icon.bounds.width - (FURNITURE_ICON_SIZE - 2)) / 2,
                  y: (data.icon.bounds.height - (FURNITURE_ICON_SIZE - 2)) / 2,
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

  const renderPreview = useMemo(() => {
    if (!selectedFurnitureData) return null;

    const isFurniture = selectedFurnitureData?.type === FurnitureType.FURNITURE;

    return (
      <ContainerComponent>
        <ContainerComponent
          position={{
            x: 47 - (isFurniture ? 0 : 16),
            y: 80 + (isFurniture ? 0 : 14),
          }}
        >
          {isFurniture ? (
            <>
              <FurnitureComponentWrapper
                position={{ x: 0, y: 0, z: 0 }}
                data={selectedFurnitureData}
              />
              <PrivateRoomTile position={{ x: -1, y: 0, z: -1 }} />
              <PrivateRoomTile position={{ x: -1, y: 0, z: 0 }} />
              <PrivateRoomTile position={{ x: -1, y: 0, z: 1 }} />
              <PrivateRoomTile position={{ x: 0, y: 0, z: -1 }} />
              <PrivateRoomTile position={{ x: 0, y: 0, z: 0 }} />
              <PrivateRoomTile position={{ x: 0, y: 0, z: 1 }} />
              <PrivateRoomTile position={{ x: 1, y: 0, z: -1 }} />
              <PrivateRoomTile position={{ x: 1, y: 0, z: 0 }} />
              <PrivateRoomTile position={{ x: 1, y: 0, z: 1 }} />
            </>
          ) : (
            <>
              <FurnitureFrameComponentWrapper
                position={{ x: 0, y: 0, z: 0 }}
                framePosition={{
                  x: 6,
                  y: selectedFurnitureData.size.height,
                }}
                data={selectedFurnitureData}
                direction={CrossDirection.EAST}
              />
              <PrivateRoomWallComponent
                direction={CrossDirection.EAST}
                position={{ x: 0, y: 0, z: 0 }}
                height={85}
              />
              <PrivateRoomWallComponent
                direction={CrossDirection.EAST}
                position={{ x: -1, y: 0, z: 0 }}
                height={85}
              />
              <PrivateRoomWallComponent
                direction={CrossDirection.EAST}
                position={{ x: 1, y: 0, z: 0 }}
                height={85}
              />
            </>
          )}
        </ContainerComponent>
        <TextComponent
          text={selectedFurnitureData.furnitureId}
          color={0}
          bold
        />
        <TextComponent text={selectedFurnitureData.description} color={0} />
      </ContainerComponent>
    );
  }, [selectedFurnitureData]);

  const previewSizeSize = {
    width: size.width - itemsContainerSize.width - 14,
  };

  return (
    <ContainerComponent {...containerProps}>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={HEADER_SIZE}
        tint={0xff00ff}
      />
      <TextComponent text={categoryId} />
      <ItemListComponent
        rows={Math.max(7, (categoryData?.furniture?.length ?? 1) / 3)}
        cols={3}
        height={itemsContainerSize.height}
        position={{ y: HEADER_SIZE + 5 }}
        items={items}
        onSelect={onSelectFurniture}
      />
      <ContainerComponent
        position={{ y: HEADER_SIZE + 5, x: itemsContainerSize.width + 11 + 3 }}
      >
        {renderPreview}
        <ContainerComponent
          position={{
            y: itemsContainerSize.height - 20,
          }}
        >
          <NineSliceSpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="background-circle-x6"
            leftWidth={2}
            rightWidth={2}
            topHeight={2}
            bottomHeight={2}
            width={previewSizeSize.width}
            height={20}
            tint={0xe0e0e0}
          />
          <ContainerComponent
            position={{
              x: previewSizeSize.width - 37 - 3,
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
      </ContainerComponent>
    </ContainerComponent>
  );
};
