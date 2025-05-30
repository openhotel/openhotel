import React, { useCallback, useMemo } from "react";
import { Cursor, EventMode, SpriteComponent } from "@openhotel/pixi-components";
import { Modal, SpriteSheetEnum } from "shared/enums";
import { useModal } from "shared/hooks";
import { MODAL_HOT_BAR_ITEMS } from "shared/consts";

type Props = {};

export const HotBarItemsComponent: React.FC<Props> = ({}) => {
  const { openModal, closeModal, isModalOpen } = useModal();

  const onPointerDown = useCallback(
    (modal: Modal) => () => {
      isModalOpen(modal) ? closeModal(modal) : openModal(modal);
    },
    [openModal, isModalOpen, closeModal],
  );

  return useMemo(
    () =>
      Object.keys(MODAL_HOT_BAR_ITEMS)
        .filter((modal) => !isNaN(modal as any))
        .map((modal) => {
          const modalId = Number(modal) as Modal;
          const { icon } = MODAL_HOT_BAR_ITEMS[modalId];
          return (
            <SpriteComponent
              key={modal}
              spriteSheet={SpriteSheetEnum.HOT_BAR_ICONS}
              texture={icon}
              eventMode={EventMode.STATIC}
              cursor={Cursor.POINTER}
              onPointerDown={onPointerDown(modalId)}
            />
          );
        }),
    [onPointerDown],
  );
};
