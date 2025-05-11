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
import { Modal, ModalInventoryTab, SpriteSheetEnum } from "shared/enums";
import { useModal } from "shared/hooks";
import { ModalInventoryCategoryProps } from "shared/types";
import { TextComponent } from "shared/components";
import { MODAL_SIZE_MAP } from "shared/consts";
import { useTranslation } from "react-i18next";
import {
  CategoryFramesComponent,
  CategoryFurnitureComponent,
  CategoryPetsComponent,
  CategoryRaresComponent,
  InventoryBarComponent,
} from ".";

const HORIZONTAL_MARGIN = 12 * 2;
const TOP_MARGIN = 38;
const BOTTOM_MARGIN = 12;
const MODAL_SIZE = MODAL_SIZE_MAP[Modal.INVENTORY];

export const InventoryComponent: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { setDragPolygon } = useDragContainer();

  const [selectedCategory, setSelectedCategory] = useState<ModalInventoryTab>(
    ModalInventoryTab.FURNITURE,
  );

  const inventoryCategoryMap = useMemo(
    (): Record<ModalInventoryTab, React.FC<ModalInventoryCategoryProps>> => ({
      [ModalInventoryTab.FURNITURE]: CategoryFurnitureComponent,
      [ModalInventoryTab.FRAMES]: CategoryFramesComponent,
      [ModalInventoryTab.PETS]: CategoryPetsComponent,
      [ModalInventoryTab.RARES]: CategoryRaresComponent,
    }),
    [],
  );

  const onCloseModal = useCallback(
    () => closeModal(Modal.INVENTORY),
    [closeModal],
  );

  useEffect(() => {
    setDragPolygon?.([0, 0, MODAL_SIZE.width, 0, MODAL_SIZE.width, 15, 0, 15]);
  }, [setDragPolygon]);

  const SelectedCategoryContent = useMemo(
    () => inventoryCategoryMap[selectedCategory],
    [inventoryCategoryMap, selectedCategory],
  );

  const contentSize = useMemo(
    () => ({
      width: MODAL_SIZE.width - HORIZONTAL_MARGIN,
      height: MODAL_SIZE.height - TOP_MARGIN - BOTTOM_MARGIN,
    }),
    [],
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
            x: MODAL_SIZE.width - 23,
            y: 1.5,
          }}
          onPointerDown={onCloseModal}
          zIndex={20}
        />
        <ContainerComponent>
          <NineSliceSpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="ui-inventory-tab-modal"
            leftWidth={14}
            rightWidth={21}
            topHeight={38}
            bottomHeight={11}
            height={MODAL_SIZE.height}
            width={MODAL_SIZE.width}
          />
          <TilingSpriteComponent
            texture="ui-inventory-modal-bar-tile"
            spriteSheet={SpriteSheetEnum.UI}
            position={{
              x: 11,
              y: 4,
            }}
            width={MODAL_SIZE.width - 35}
          />
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.CENTER}
            size={{
              width: MODAL_SIZE.width,
            }}
            position={{
              y: 3,
            }}
          >
            <TextComponent
              text={t("inventory.title")}
              backgroundColor={0xdbab7a}
              backgroundAlpha={1}
              color={0xa37b52}
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
            <InventoryBarComponent
              onSelectCategory={setSelectedCategory}
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
      onCloseModal,
      setSelectedCategory,
      selectedCategory,
      SelectedCategoryContent,
      contentSize,
    ],
  );
};
