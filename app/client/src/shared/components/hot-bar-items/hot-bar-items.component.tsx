import React, { useMemo } from "react";
import { Cursor, EventMode, SpriteComponent } from "@oh/pixi-components";
import { Modal, SpriteSheetEnum } from "shared/enums";
import { useModal } from "shared/hooks";
import {
  CatalogComponent,
  ClubComponent,
  ConsoleComponent,
  InventoryComponent,
  NavigatorComponent,
  PurseComponent,
} from "modules/modals";

type Props = {};

export const HotBarItemsComponent: React.FC<Props> = () => {
  const { openModal, closeModal, isModalOpen } = useModal();

  const MODAL_HOT_BAR_ITEMS = {
    [Modal.CONSOLE]: {
      icon: "console-off",
      component: ConsoleComponent,
    },
    [Modal.NAVIGATOR]: {
      icon: "navigator",
      component: NavigatorComponent,
    },
    [Modal.CATALOG]: {
      icon: "catalog",
      component: CatalogComponent,
    },
    [Modal.INVENTORY]: {
      icon: "navigator",
      component: InventoryComponent,
    },
    [Modal.PURSE]: {
      icon: "purse",
      component: PurseComponent,
    },
    [Modal.CLUB]: {
      icon: "club",
      component: ClubComponent,
    },
  };

  const renderItems = useMemo(
    () =>
      Object.keys(MODAL_HOT_BAR_ITEMS)
        .filter((modal) => !isNaN(modal as any))
        .map((modal) => {
          const modalId = modal as unknown as Modal;
          const { icon, component } = MODAL_HOT_BAR_ITEMS[modalId];
          return (
            <SpriteComponent
              key={modal}
              spriteSheet={SpriteSheetEnum.HOT_BAR_ICONS}
              texture={icon}
              eventMode={EventMode.STATIC}
              cursor={Cursor.POINTER}
              onPointerDown={() =>
                isModalOpen(modalId)
                  ? closeModal(modalId)
                  : openModal(modalId, component)
              }
            />
          );
        }),
    [openModal, isModalOpen, closeModal],
  );
  return <>{renderItems}</>;
};
