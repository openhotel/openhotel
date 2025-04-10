import React from "react";
import {
  ContainerComponent,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  NineSliceSpriteComponent,
  TilingSpriteComponent,
  GraphicType,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components";
import { CategoriesComponent } from "modules/modals/components/catalog/components";

export const CatalogComponent: React.FC = () => {
  const width = 300;
  const height = 200;

  const headerHeight = 17;

  const contentPadding = 5;

  const overModalPosition = {
    x: 12,
  };
  const overModalPadding = 5;

  const overModalSize = {
    width: width - 100,
    height: height + overModalPadding * 2,
  };

  return (
    <ContainerComponent position={{ x: 10, y: 10 }}>
      <ContainerComponent position={{ y: overModalPadding }}>
        <NineSliceSpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="ui-base-modal"
          leftWidth={14}
          rightWidth={21}
          topHeight={22}
          bottomHeight={11}
          height={height}
          width={width}
        />
        <TilingSpriteComponent
          texture="ui-base-modal-bar-tile"
          spriteSheet={SpriteSheetEnum.UI}
          position={{
            x: 11,
            y: 4,
          }}
          width={width - 35}
        />
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.CENTER}
          size={{
            width,
          }}
          position={{
            y: 4,
          }}
        >
          <TextComponent
            text="Catalog"
            backgroundColor={0xacc1ed}
            backgroundAlpha={1}
            padding={{
              left: 4,
              right: 3,
              bottom: 0,
              top: 1,
            }}
          />
        </FlexContainerComponent>
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          tint={0}
          alpha={0.125}
          width={overModalSize.width + 2}
          height={height}
          pivot={{
            x: 1,
          }}
          position={overModalPosition}
        />
        <CategoriesComponent
          position={{
            x: overModalPosition.x + overModalSize.width,
            y: headerHeight + contentPadding,
          }}
        />
      </ContainerComponent>
      <ContainerComponent position={overModalPosition}>
        <NineSliceSpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="catalog-base-modal"
          leftWidth={3}
          rightWidth={3}
          topHeight={3}
          bottomHeight={6}
          width={overModalSize.width}
          height={overModalSize.height}
        />
      </ContainerComponent>
    </ContainerComponent>
  );
};
