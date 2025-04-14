import React from "react";
import {
  ContainerComponent,
  ContainerProps,
  NineSliceSpriteComponent,
  ScrollableContainerComponent,
  SpriteComponent,
  TilingSpriteComponent,
} from "@openhotel/pixi-components";
import { Size2d } from "shared/types";
import { SpriteSheetEnum } from "shared/enums";
import { SCROLL_HEIGHT } from "shared/consts";

type Props = {
  size: Size2d;
  scrollHeight?: number;
} & ContainerProps;

export const ScrollComponent: React.FC<Props> = ({
  size,
  scrollHeight = SCROLL_HEIGHT,
  children,
  ...containerProps
}) => {
  if (!children) return null;

  return (
    <ScrollableContainerComponent
      size={size}
      scrollbar={{
        renderTop: () => (
          <SpriteComponent
            texture="scrollbar-arrow-top"
            spriteSheet={SpriteSheetEnum.UI}
          />
        ),
        renderBottom: () => (
          <SpriteComponent
            texture="scrollbar-arrow-bottom"
            spriteSheet={SpriteSheetEnum.UI}
          />
        ),
        renderScrollBackground: () => (
          <TilingSpriteComponent
            texture="scrollbar-background"
            spriteSheet={SpriteSheetEnum.UI}
            height={size.height - 22}
          />
        ),
        renderScrollBar: () => (
          <ContainerComponent>
            <NineSliceSpriteComponent
              texture="scrollbar-scroll-bar"
              spriteSheet={SpriteSheetEnum.UI}
              leftWidth={4}
              rightWidth={4}
              topHeight={4}
              bottomHeight={4}
              height={scrollHeight}
            />
            <TilingSpriteComponent
              texture="scrollbar-scroll-bar-background"
              spriteSheet={SpriteSheetEnum.UI}
              height={scrollHeight - 6}
              position={{
                x: 2,
                y: 3,
              }}
            />
          </ContainerComponent>
        ),
      }}
      children={children}
      {...containerProps}
    />
  );
};
