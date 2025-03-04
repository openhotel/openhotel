import React from "react";
import { ContainerComponent, SpriteComponent } from "@oh/pixi-components";
import { SpriteSheetEnum } from "shared/enums";

export const PurseComponent: React.FC = () => {
  return (
    <ContainerComponent>
      <SpriteComponent spriteSheet={SpriteSheetEnum.UI} texture="purse" />
    </ContainerComponent>
  );
};
