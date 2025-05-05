import React, { useMemo } from "react";
import {
  ContainerComponent,
  ContainerProps,
  NineSliceSpriteComponent,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components";

type Props = {
  selected?: boolean;
  type?: "top" | "middle" | "bottom";
  text: string;
  width: number;
} & ContainerProps;

export const CategoryOptionComponent: React.FC<Props> = ({
  selected = false,
  type = "middle",
  text,
  width,
  ...containerProps
}) => {
  return useMemo(
    () => (
      <ContainerComponent {...containerProps}>
        <NineSliceSpriteComponent
          texture={`catalog-button-${type}${selected ? "-selected" : ""}`}
          spriteSheet={SpriteSheetEnum.UI}
          leftWidth={3}
          rightWidth={3}
          topHeight={3}
          bottomHeight={3}
          width={width}
          height={14}
        />
        <TextComponent
          text={text}
          color={0}
          position={{
            x: 10,
            y: 4,
          }}
        />
      </ContainerComponent>
    ),
    [containerProps, type, selected, text, width],
  );
};
