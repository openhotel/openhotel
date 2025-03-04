import React from "react";
import { ContainerComponent, SpriteComponent } from "@oh/pixi-components";
import { SpriteSheetEnum } from "shared/enums";

export const NavigatorComponent: React.FC = () => {
  return (
    <ContainerComponent>
      <SpriteComponent
        spriteSheet={SpriteSheetEnum.HOT_BAR_ICONS}
        texture="navigator"
      />
    </ContainerComponent>
  );
};
