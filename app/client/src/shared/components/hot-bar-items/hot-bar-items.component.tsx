import React, { useMemo } from "react";
import { Cursor, EventMode, SpriteComponent } from "@oh/pixi-components";
import { Modal, SpriteSheetEnum } from "shared/enums";
import { useModal } from "shared/hooks";
import { MODAL_HOT_BAR_ITEMS } from "shared/consts";

type Props = {};

export const HotBarItemsComponent: React.FC<Props> = () => {
  const { openModal } = useModal();

  const renderItems = useMemo(
    () =>
      Object.keys(MODAL_HOT_BAR_ITEMS)
        .filter((modal) => !isNaN(modal as any))
        .map((modal) => {
          const { icon, component } = MODAL_HOT_BAR_ITEMS[modal];
          return (
            <SpriteComponent
              key={modal}
              spriteSheet={SpriteSheetEnum.HOT_BAR_ICONS}
              texture={icon}
              eventMode={EventMode.STATIC}
              cursor={Cursor.POINTER}
              onPointerDown={() =>
                openModal(modal as unknown as Modal, component)
              }
            />
          );
        }),
    [openModal],
  );
  return <>{renderItems}</>;
};
