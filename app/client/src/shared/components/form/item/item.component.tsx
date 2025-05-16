import React from "react";
import {
  ContainerComponent,
  ContainerProps,
  NineSliceSpriteComponent,
  Size,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  size: Size;
  children?: React.ReactNode;
  color: "" | "gray" | "blue";
} & ContainerProps;

export const ItemComponent: React.FC<Props> = ({
  size,
  children,
  color = "",
  ...containerProps
}) => {
  return (
    <ContainerComponent {...containerProps}>
      <NineSliceSpriteComponent
        texture={`input${color?.length ? `-${color}` : ""}`}
        spriteSheet={SpriteSheetEnum.UI}
        leftWidth={2}
        rightWidth={2}
        topHeight={2}
        bottomHeight={2}
        width={size.width}
        height={size.height}
        angle={180}
        pivot={{
          x: size.width,
          y: size.height,
        }}
      />
      {children ? (
        <ContainerComponent
          position={{
            x: 4,
            y: 4,
          }}
        >
          {children}
        </ContainerComponent>
      ) : null}
    </ContainerComponent>
  );
};
