import React from "react";
import {
  ContainerComponent,
  ContainerProps,
  NineSliceSpriteComponent,
} from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";
import { SpriteSheetEnum } from "shared/enums";

type Props = {} & ContainerProps;

export const CategoriesComponent: React.FC<Props> = ({ ...containerProps }) => {
  const width = 75;
  return (
    <ContainerComponent {...containerProps}>
      <NineSliceSpriteComponent
        texture={"catalog-button-top-selected"}
        spriteSheet={SpriteSheetEnum.UI}
        leftWidth={3}
        rightWidth={3}
        topHeight={3}
        bottomHeight={3}
        width={width}
        height={14}
      />
      <TextComponent
        text="alpha"
        color={0}
        position={{
          x: 10,
          y: 4,
        }}
      />
      <NineSliceSpriteComponent
        texture={"catalog-button-middle-selected"}
        spriteSheet={SpriteSheetEnum.UI}
        leftWidth={3}
        rightWidth={3}
        topHeight={3}
        bottomHeight={3}
        width={width}
        height={14}
        position={{ y: 13 }}
      />
      <NineSliceSpriteComponent
        texture={"catalog-button-bottom-selected"}
        spriteSheet={SpriteSheetEnum.UI}
        leftWidth={3}
        rightWidth={3}
        topHeight={3}
        bottomHeight={3}
        width={width}
        height={14}
        position={{ y: 13 * 2 }}
      />
    </ContainerComponent>
  );
};
