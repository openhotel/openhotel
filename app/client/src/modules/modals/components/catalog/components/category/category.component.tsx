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
import { ScrollComponent, TextComponent } from "shared/components";
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
          <ContainerComponent position={{ x: x * (24 + 3), y: y * (24 + 3) }}>
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
            {furniture ? (
              <SpriteComponent
                position={{ x: 1, y: 1 }}
                texture={data.icon.texture}
                spriteSheet={data.spriteSheet}
                pivot={{
                  x: (data.icon.bounds.width - 22) / 2,
                  y: (data.icon.bounds.height - 22) / 2,
                }}
              />
            ) : null}
          </ContainerComponent>
        ));
      }
    }
    return items.map((Comp, index) => <Comp key={`furni_${index}`} />);
  }, [isLoading, categoryData]);

  return (
    <ContainerComponent {...containerProps}>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={32}
        tint={0xff00ff}
      />
      <TextComponent text={categoryId} />
      {!isLoading ? (
        <ScrollComponent
          size={{ width: (24 + 3) * 3, height: size.height - 32 - 5 }}
          position={{ y: 32 + 5 }}
        >
          {renderItems}
        </ScrollComponent>
      ) : null}
    </ContainerComponent>
  );
};
