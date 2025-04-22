import React from "react";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
} from "@openhotel/pixi-components";

type Props = {
  width: number;
  height: number;
  padding?: number;
  color?: number;
  percentage?: number;
};

export const LoadingBarComponent: React.FC<Props> = ({
  color = 0xffffff,
  padding = 1,
  width,
  height,
  percentage = 0.5,
}) => {
  return (
    <ContainerComponent>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={(width - padding * 4) * percentage}
        height={height - padding * 4}
        position={{
          x: padding * 2,
          y: padding * 2,
        }}
        tint={color}
      />
      <GraphicsComponent
        type={GraphicType.POLYGON}
        polygon={[
          0,
          0,
          //
          width,
          0,
          //
          width,
          height,
          //
          0,
          height,
          //
          0,
          padding,
          //
          padding,
          padding,
          //
          padding,
          height - padding,
          //
          width - padding,
          height - padding,
          //
          width - padding,
          padding,
          //
          0,
          padding,
        ]}
        tint={color}
      />
    </ContainerComponent>
  );
};
