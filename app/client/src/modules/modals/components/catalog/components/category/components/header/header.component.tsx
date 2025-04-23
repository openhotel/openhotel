import React, { useMemo } from "react";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
} from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";

type Props = {
  size: Size;
  description: string;
};

export const HeaderComponent: React.FC<Props> = ({ size, description }) => {
  const coverHeight = useMemo(
    () =>
      size.height -
      //text two lines
      15 -
      //padding
      5,
    [size],
  );

  return (
    <ContainerComponent>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={coverHeight}
        tint={0xff00ff}
        alpha={0.2}
      />
      <TextComponent
        text={description}
        maxWidth={size.width}
        color={0}
        position={{
          y: coverHeight + 5,
        }}
      />
    </ContainerComponent>
  );
};
