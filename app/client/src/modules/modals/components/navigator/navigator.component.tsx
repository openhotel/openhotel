import React, { useCallback } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  NineSliceSpriteComponent,
  TilingSpriteComponent,
} from "@oh/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components";
import { NavigatorBarComponent } from "./components";

export const NavigatorComponent: React.FC = () => {
  const height = 260;
  const width = 300;
  const horizontalMargin = 12 * 2;
  const topMargin = 38;
  const bottomMargin = 12;

  const onSelectItem = useCallback((item: string) => {
    console.log(item);
  }, []);

  return (
    <ContainerComponent>
      <NineSliceSpriteComponent
        spriteSheet={SpriteSheetEnum.UI}
        texture="ui-tab-modal"
        leftWidth={14}
        rightWidth={21}
        topHeight={39}
        bottomHeight={11}
        height={height}
        width={width}
      />
      <TilingSpriteComponent
        texture="ui-tab-modal-bar-tile"
        spriteSheet={SpriteSheetEnum.UI}
        position={{
          x: 11,
          y: 4,
        }}
        width={width - 35}
      />
      <ContainerComponent>
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={width}
          height={15}
          alpha={0}
          cursor={Cursor.GRAB}
          eventMode={EventMode.STATIC}
        />
        <GraphicsComponent
          type={GraphicType.CIRCLE}
          radius={6.5}
          alpha={0}
          cursor={Cursor.POINTER}
          eventMode={EventMode.STATIC}
          position={{
            x: width - 23,
            y: 1.5,
          }}
        />
      </ContainerComponent>
      <FlexContainerComponent
        justify={FLEX_JUSTIFY.CENTER}
        size={{
          width,
        }}
        position={{
          y: 4,
        }}
      >
        <TextComponent
          text="Navigator"
          backgroundColor={0xacc1ed}
          backgroundAlpha={1}
          padding={{
            left: 4,
            right: 0,
            bottom: 0,
            top: 1,
          }}
        />
      </FlexContainerComponent>
      <ContainerComponent
        position={{
          x: 5,
          y: 15,
        }}
      >
        <NavigatorBarComponent
          categories={["Hotel", "Rooms", "Me", "Search"]}
          onSelectCategory={onSelectItem}
        />
      </ContainerComponent>
      <ContainerComponent
        position={{
          x: 12,
          y: 38,
        }}
      >
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          tint={0xff00ff}
          width={width - horizontalMargin}
          height={height - topMargin - bottomMargin}
        />
      </ContainerComponent>
    </ContainerComponent>
  );
};
