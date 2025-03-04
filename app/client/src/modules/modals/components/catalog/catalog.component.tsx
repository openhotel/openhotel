import React from "react";
import { ContainerComponent, SpriteComponent } from "@oh/pixi-components";
import { SpriteSheetEnum } from "shared/enums";

export const CatalogComponent: React.FC = () => {
  return (
    <ContainerComponent>
      <SpriteComponent spriteSheet={SpriteSheetEnum.UI} texture="catalog" />
    </ContainerComponent>
  );
};
