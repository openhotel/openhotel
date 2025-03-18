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
  useWindow,
} from "@oh/pixi-components";
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

export const NavigatorComponent: React.FC = () => {
  const { setDragPolygon } = useDragContainer();
  const { closeModal, setModalPosition } = useModal();
  const { getSize } = useWindow();

  const height = 260;
  const width = 250;
  const horizontalMargin = 12 * 2;
  const topMargin = 38;
  const bottomMargin = 12;

  const [selectedCategory, setSelectedCategory] = useState<ModalNavigatorTab>(
    ModalNavigatorTab.ROOMS,
  );

  const onSelectCategoryTab = useCallback((tab: ModalNavigatorTab) => {
    setSelectedCategory(tab);
  }, []);

  useEffect(() => {
    setDragPolygon?.([0, 0, width, 0, width, 15, 0, 15]);
  }, [setDragPolygon]);

  useEffect(() => {
    const windowSize = getSize();

    setModalPosition(Modal.NAVIGATOR, {
      x: windowSize.width / 2 - width / 2,
      y: windowSize.height / 2 - height / 2,
    });
  }, [setModalPosition, getSize, width, height]);

  const SelectedCategoryContent = useMemo(
    () =>
      ({
        [ModalNavigatorTab.HOTEL]: CategoryHotelComponent,
        [ModalNavigatorTab.ROOMS]: CategoryRoomsComponent,
        [ModalNavigatorTab.ME]: CategoryMeComponent,
        [ModalNavigatorTab.SEARCH]: CategorySearchComponent,
      })[selectedCategory],
    [selectedCategory],
  );

  const contentSize = useMemo(
    () => ({
      width: width - horizontalMargin,
      height: height - topMargin - bottomMargin,
    }),
    [width, horizontalMargin, height, topMargin, bottomMargin],
  );

  return (
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
        onPointerDown={() => closeModal(Modal.NAVIGATOR)}
        zIndex={20}
      />
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
          {/*<GraphicsComponent*/}
          {/*  type={GraphicType.RECTANGLE}*/}
          {/*  tint={0xff00ff}*/}
          {/*  width={contentSize.width}*/}
          {/*  height={contentSize.height}*/}
          {/*/>*/}
          <SelectedCategoryContent size={contentSize} />
        </ContainerComponent>
      </ContainerComponent>
    </>
  );
};
