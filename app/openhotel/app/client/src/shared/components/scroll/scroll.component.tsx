import React, { useCallback, useMemo } from "react";
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
import { SCROLL_BAR_WIDTH, SCROLL_HEIGHT } from "shared/consts";

type Props = {
  size: Size2d;
  scrollHeight?: number;
  /**
   * Renders only the empty scroll without the fancy stuff
   */
  mock?: boolean;
} & ContainerProps;

export const ScrollComponent: React.FC<Props> = ({
  size,
  scrollHeight = SCROLL_HEIGHT,
  children,
  mock,
  ...containerProps
}) => {
  const renderTop = useCallback(
    () => (
      <SpriteComponent
        texture="scrollbar-arrow-top"
        spriteSheet={SpriteSheetEnum.UI}
      />
    ),
    [],
  );
  const renderBottom = useCallback(
    () => (
      <SpriteComponent
        texture="scrollbar-arrow-bottom"
        spriteSheet={SpriteSheetEnum.UI}
      />
    ),
    [],
  );
  const renderScrollBackground = useCallback(
    () => (
      <TilingSpriteComponent
        texture="scrollbar-background"
        spriteSheet={SpriteSheetEnum.UI}
        height={size.height - SCROLL_BAR_WIDTH * 2}
      />
    ),
    [size.height],
  );

  if (mock) {
    return useMemo(
      () => (
        <>
          <ContainerComponent position={{ x: size.width }}>
            <ContainerComponent>{renderTop()}</ContainerComponent>
            <ContainerComponent position={{ y: SCROLL_BAR_WIDTH }}>
              {renderScrollBackground()}
            </ContainerComponent>
            <ContainerComponent
              position={{ y: size.height - SCROLL_BAR_WIDTH }}
            >
              {renderBottom()}
            </ContainerComponent>
          </ContainerComponent>
          {children}
        </>
      ),
      [size, renderScrollBackground, renderBottom, children],
    );
  }

  if (!children) return null;

  return useMemo(
    () => (
      <ScrollableContainerComponent
        size={size}
        scrollbar={{
          renderTop,
          renderBottom,
          renderScrollBackground,
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
    ),
    [
      size,
      renderTop,
      renderBottom,
      renderScrollBackground,
      scrollHeight,
      children,
      containerProps,
    ],
  );
};
