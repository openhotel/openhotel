import React from "react";
import { TextComponent } from "shared/components";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
} from "@oh/pixi-components";

type Props = {
  size: Size;
};

export const CategoryRoomsComponent: React.FC<Props> = ({ size }) => {
  return (
    <ContainerComponent>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width - 10}
        height={100}
        tint={0xffff00}
      />
      <TextComponent text="Rooms" color={1} />
    </ContainerComponent>
  );
};
