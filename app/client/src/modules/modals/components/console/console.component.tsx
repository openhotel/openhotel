import React from "react";
import { ContainerComponent, SpriteComponent } from "@oh/pixi-components";
import { SpriteSheetEnum } from "shared/enums";

export const ConsoleComponent: React.FC = () => {
  return (
    <ContainerComponent>
      <SpriteComponent
        spriteSheet={SpriteSheetEnum.HOT_BAR_ICONS}
        texture="console-off"
      />
    </ContainerComponent>
  );
};
