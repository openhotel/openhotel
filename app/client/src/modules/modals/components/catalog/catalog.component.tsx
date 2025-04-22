import React from "react";
import {
  ContainerComponent,
  SpriteComponent,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";

export const CatalogComponent: React.FC = () => {
  return (
    <ContainerComponent>
      <SpriteComponent
        spriteSheet={SpriteSheetEnum.HOT_BAR_ICONS}
        texture="catalog"
      />
    </ContainerComponent>
  );
};
