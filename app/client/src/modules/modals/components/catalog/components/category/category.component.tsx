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
import { ItemListComponent, TextComponent } from "shared/components";
import { useApi, useFurniture } from "shared/hooks";
import { SpriteSheetEnum } from "shared/enums";

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

  useEffect(() => {
    setCategoryData(null);
    fetch(`/catalog?category=${categoryId}`).then(
      (category: CatalogCategoryData) => {
        load(...category.furniture.map((furniture) => furniture.id));
        setCategoryData(category);
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
      />
      <ContainerComponent
        position={{ y: HEADER_SIZE + 5, x: itemsContainerSize.width + 11 + 3 }}
      >
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
