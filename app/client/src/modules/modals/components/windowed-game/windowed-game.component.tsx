import React, { useMemo, useState } from "react";
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
} from "@openhotel/pixi-components";
import { ModalNavigatorTab, SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components";
import { useTranslation } from "react-i18next";
import { Size2d } from "shared/types";

const HORIZONTAL_MARGIN = 12 * 2;
const TOP_MARGIN = 38;
const BOTTOM_MARGIN = 12;

type Props = {
  gameName: string;
  size: Size2d;
  onCloseModal?: () => void;
};

export const WindowedGameComponent: React.FC<Props> = ({
  gameName,
  size,
  onCloseModal,
}) => {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState<ModalNavigatorTab>(
    ModalNavigatorTab.ROOMS,
  );

  const contentSize = useMemo(
    () => ({
      width: size.width - HORIZONTAL_MARGIN,
      height: size.height - TOP_MARGIN - BOTTOM_MARGIN,
    }),
    [],
  );

  return useMemo(
    () => (
      <ContainerComponent>
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={size.width - 22}
          height={size.height - 32}
          tint={0}
          position={{
            x: 11,
            y: 21,
          }}
        />
        <GraphicsComponent
          type={GraphicType.CIRCLE}
          radius={6.5}
          alpha={0}
          cursor={Cursor.POINTER}
          eventMode={EventMode.STATIC}
          position={{
            x: size.width - 23,
            y: 2,
          }}
          onPointerDown={onCloseModal}
          zIndex={20}
        />
        <NineSliceSpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="dark-game-window"
          leftWidth={17}
          rightWidth={26}
          topHeight={27}
          bottomHeight={16}
          height={size.height}
          width={size.width}
        />
        <TilingSpriteComponent
          texture="dark-game-window-bar-title"
          spriteSheet={SpriteSheetEnum.UI}
          position={{
            x: 11,
            y: 4,
          }}
          width={size.width - 35}
        />
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.CENTER}
          size={{
            width: size.width,
          }}
          position={{
            y: 3,
          }}
        >
          <TextComponent
            text={gameName}
            backgroundColor={0x393939}
            backgroundAlpha={1}
            padding={{
              left: 4,
              right: 3,
              bottom: 0,
              top: 2,
            }}
            color={0x4a4a4a}
          />
        </FlexContainerComponent>
      </ContainerComponent>
    ),
    [t, onCloseModal, setSelectedCategory, selectedCategory, contentSize],
  );
};
