import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  useDragContainer,
} from "@openhotel/pixi-components";
import { Modal, ModalNavigatorTab, SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components";
import {
  CategoryHotelComponent,
  CategoryMeComponent,
  CategoryRoomsComponent,
  CategorySearchComponent,
  NavigatorBarComponent,
} from "./components";
import { useModal } from "shared/hooks";
import { MODAL_SIZE_MAP } from "shared/consts";
import { ModalNavigatorTabProps } from "shared/types";
import { useTranslation } from "react-i18next";

export const NavigatorComponent: React.FC = () => {
  const { closeModal } = useModal();

  const navigatorTabMap = useMemo(
    (): Record<ModalNavigatorTab, React.FC<ModalNavigatorTabProps>> => ({
      [ModalNavigatorTab.HOTEL]: CategoryHotelComponent,
      [ModalNavigatorTab.ROOMS]: CategoryRoomsComponent,
      [ModalNavigatorTab.ME]: CategoryMeComponent,
      [ModalNavigatorTab.SEARCH]: CategorySearchComponent,
    }),
    [],
  );

  const onCloseModal = useCallback(
    () => closeModal(Modal.NAVIGATOR),
    [closeModal],
  );

  return useMemo(
    () => (
      <NavigatorComponentWrapper
        onPointerDown={onCloseModal}
        navigatorTabMap={navigatorTabMap}
      />
    ),
    [navigatorTabMap, onCloseModal],
  );
};

const HORIZONTAL_MARGIN = 12 * 2;
const TOP_MARGIN = 38;
const BOTTOM_MARGIN = 12;

type Props = {
  onPointerDown: () => void;
  navigatorTabMap: Record<ModalNavigatorTab, React.FC<ModalNavigatorTabProps>>;
};

export const NavigatorComponentWrapper: React.FC<Props> = ({
  onPointerDown,
  navigatorTabMap,
}) => {
  const { t } = useTranslation();
  const { setDragPolygon } = useDragContainer();
  const { width, height } = MODAL_SIZE_MAP[Modal.NAVIGATOR];

  const [selectedCategory, setSelectedCategory] = useState<ModalNavigatorTab>(
    ModalNavigatorTab.ROOMS,
  );

  const onSelectCategoryTab = useCallback((tab: ModalNavigatorTab) => {
    setSelectedCategory(tab);
  }, []);

  useEffect(() => {
    setDragPolygon?.([0, 0, width, 0, width, 15, 0, 15]);
  }, [setDragPolygon]);

  const SelectedCategoryContent = useMemo(
    () => navigatorTabMap[selectedCategory],
    [navigatorTabMap, selectedCategory],
  );

  const contentSize = useMemo(
    () => ({
      width: width - HORIZONTAL_MARGIN,
      height: height - TOP_MARGIN - BOTTOM_MARGIN,
    }),
    [width, HORIZONTAL_MARGIN, height, TOP_MARGIN, BOTTOM_MARGIN],
  );

  return useMemo(
    () => (
      <>
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
          onPointerDown={onPointerDown}
          zIndex={20}
        />
        <ContainerComponent>
          <NineSliceSpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="ui-tab-modal"
            leftWidth={14}
            rightWidth={21}
            topHeight={38}
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
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.CENTER}
            size={{
              width,
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
            <NavigatorBarComponent
              onSelectCategory={onSelectCategoryTab}
              selectedCategory={selectedCategory}
            />
          </ContainerComponent>
          <ContainerComponent
            position={{
              x: 12,
              y: 38,
            }}
          >
            <SelectedCategoryContent size={contentSize} />
          </ContainerComponent>
        </ContainerComponent>
      </>
    ),
    [
      t,
      width,
      onPointerDown,
      height,
      onSelectCategoryTab,
      selectedCategory,
      contentSize,
    ],
  );
};
