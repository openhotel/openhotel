import React, { useCallback, useMemo, useState } from "react";
import {
  ContainerComponent,
  FLEX_JUSTIFY,
  FlexContainerComponent,
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
  size: Size2d;
};

export const WindowedGameComponent: React.FC<Props> = ({ size }) => {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState<ModalNavigatorTab>(
    ModalNavigatorTab.ROOMS,
  );

  const onCloseModal = useCallback(() => {}, []);

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
        <NineSliceSpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="ui-tab-modal"
          leftWidth={14}
          rightWidth={21}
          topHeight={38}
          bottomHeight={11}
          height={size.height}
          width={size.width}
        />
        <TilingSpriteComponent
          texture="ui-tab-modal-bar-tile"
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
            text={t("navigator.title")}
            backgroundColor={0xacc1ed}
            backgroundAlpha={1}
            padding={{
              left: 4,
              right: 3,
              bottom: 0,
              top: 2,
            }}
          />
        </FlexContainerComponent>
        <ContainerComponent
          position={{
            x: 5,
            y: 15,
          }}
        >
          <TextComponent text="test 1" />
        </ContainerComponent>
        <ContainerComponent
          position={{
            x: 12,
            y: 38,
          }}
        >
          <TextComponent text="test 2" />
        </ContainerComponent>
      </ContainerComponent>
    ),
    [t, onCloseModal, setSelectedCategory, selectedCategory, contentSize],
  );
};
