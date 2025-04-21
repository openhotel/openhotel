import React, { useEffect, useMemo, useState } from "react";
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
import { ScrollComponent, TextComponent } from "shared/components";
import { useApi, useFurniture } from "shared/hooks";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  size: Size2d;
  categoryId: string;
} & ContainerProps;

const HEADER_SIZE = 32;
const FURNITURE_ICON_SIZE = 24;

export const CategoryComponent: React.FC<Props> = ({
  size,
  categoryId,
  ...containerProps
}) => {
  const { fetch } = useApi();
  const { load, get } = useFurniture();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryData, setCategoryData] = useState<CatalogCategoryData>(null);

  useEffect(() => {
    setIsLoading(true);
    setCategoryData(null);
    fetch(`/catalog?category=${categoryId}`).then(
      (category: CatalogCategoryData) => {
        load(...category.furniture.map((furniture) => furniture.id)).then(() =>
          setIsLoading(false),
        );
        setCategoryData(category);
      },
    );
  }, [fetch, categoryId, setIsLoading, setCategoryData]);

  const renderItems = useMemo(() => {
    if (isLoading) return null;
    const items = [];
    const yLength = Math.max(7, (categoryData?.furniture?.length ?? 1) / 3);
    for (let y = 0; y < yLength; y++) {
      for (let x = 0; x < 3; x++) {
        // if (isLoading) {
        //   items.push(() => (
        //     <ContainerComponent position={{ x: x * (24 + 3), y: y * (24 + 3) }}>
        //       <NineSliceSpriteComponent
        //         spriteSheet={SpriteSheetEnum.UI}
        //         texture="background-circle-x6"
        //         leftWidth={2}
        //         rightWidth={2}
        //         topHeight={2}
        //         bottomHeight={2}
        //         width={24}
        //         height={24}
        //         tint={0xe0e0e0}
        //       />
        //     </ContainerComponent>
        //   ));
        //   continue;
        // }

        const index = x + y * 3;
        const furniture = categoryData.furniture[index];

        const data = furniture ? get(furniture.id) : null;

        items.push(() => (
          <ContainerComponent
            position={{
              x: x * (FURNITURE_ICON_SIZE + 3),
              y: y * (FURNITURE_ICON_SIZE + 3),
            }}
          >
            <NineSliceSpriteComponent
              spriteSheet={SpriteSheetEnum.UI}
              texture="background-circle-x6"
              leftWidth={2}
              rightWidth={2}
              topHeight={2}
              bottomHeight={2}
              width={FURNITURE_ICON_SIZE}
              height={FURNITURE_ICON_SIZE}
              tint={0xe0e0e0}
            />
            {furniture ? (
              <SpriteComponent
                position={{ x: 1, y: 1 }}
                texture={data.icon.texture}
                spriteSheet={data.spriteSheet}
                pivot={{
                  x: (data.icon.bounds.width - (FURNITURE_ICON_SIZE - 2)) / 2,
                  y: (data.icon.bounds.height - (FURNITURE_ICON_SIZE - 2)) / 2,
                }}
              />
            ) : null}
          </ContainerComponent>
        ));
      }
    }
    return items.map((Comp, index) => <Comp key={`furni_${index}`} />);
  }, [isLoading, categoryData]);

  const itemsContainerSize = {
    width: (FURNITURE_ICON_SIZE + 3) * 3,
    height: size.height - HEADER_SIZE - 5,
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
      {!isLoading ? (
        <ScrollComponent
          size={itemsContainerSize}
          position={{ y: HEADER_SIZE + 5 }}
        >
          {renderItems}
        </ScrollComponent>
      ) : null}
      <ContainerComponent
        position={{ y: HEADER_SIZE + 5, x: itemsContainerSize.width + 11 + 3 }}
      >
        {/*<GraphicsComponent*/}
        {/*  type={GraphicType.RECTANGLE}*/}
        {/*  width={119 - 7}*/}
        {/*  height={itemsContainerSize.height}*/}
        {/*  tint={0xff00ff}*/}
        {/*/>*/}
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
            width={119 - 7}
            height={20}
            tint={0xe0e0e0}
          />
          <ContainerComponent
            position={{
              x: 72,
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
