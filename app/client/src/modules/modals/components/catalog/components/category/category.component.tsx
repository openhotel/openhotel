import React, { useEffect, useMemo, useState } from "react";
import { CatalogCategoryData, Size2d } from "shared/types";
import {
  ContainerComponent,
  ContainerProps,
  GraphicsComponent,
  GraphicType,
  NineSliceSpriteComponent,
  SpriteComponent,
} from "@openhotel/pixi-components";
import { FurnitureComponentWrapper, TextComponent } from "shared/components";
import { useApi, useFurniture } from "shared/hooks";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  size: Size2d;
  categoryId: string;
} & ContainerProps;

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
        console.log(category.furniture.map((furniture) => furniture.id));
        load(...category.furniture.map((furniture) => furniture.id)).then(() =>
          setIsLoading(false),
        );
        setCategoryData(category);
      },
    );
  }, [fetch, categoryId, setIsLoading, setCategoryData]);

  const renderItems = useMemo(
    () =>
      isLoading
        ? null
        : categoryData.furniture.map((furniture, index) => {
            const data = get(furniture.id);

            const x = (index % 3) * (24 + 3);
            const y = Math.trunc(index / 3) * (24 + 3);

            return (
              <ContainerComponent key={furniture.id} position={{ x, y }}>
                <NineSliceSpriteComponent
                  spriteSheet={SpriteSheetEnum.UI}
                  texture="background-circle-x6"
                  leftWidth={2}
                  rightWidth={2}
                  topHeight={2}
                  bottomHeight={2}
                  width={24}
                  height={24}
                  tint={0xe0e0e0}
                />
                {/*<FurnitureComponentWrapper*/}
                {/*  position={{ x: 0, y: 0, z: 0 }}*/}
                {/*  id={furniture.id}*/}
                {/*  data={get(furniture.id)}*/}
                {/*/>*/}
                <SpriteComponent
                  position={{ x: 1, y: 1 }}
                  texture={data.icon.texture}
                  spriteSheet={data.spriteSheet}
                  pivot={{
                    x: (data.icon.bounds.width - 22) / 2,
                    y: (data.icon.bounds.height - 22) / 2,
                  }}
                />
              </ContainerComponent>
            );
          }),
    [isLoading, categoryData],
  );

  return (
    <ContainerComponent {...containerProps}>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={32}
        tint={0xff00ff}
      />
      <TextComponent text={categoryId} />
      <ContainerComponent position={{ y: 32 + 5 }}>
        {renderItems}
      </ContainerComponent>
    </ContainerComponent>
  );
};
