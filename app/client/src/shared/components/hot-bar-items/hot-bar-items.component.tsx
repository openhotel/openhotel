import React, { useMemo } from "react";
import { Cursor, EventMode, SpriteComponent } from "@oh/pixi-components";
import { Modal, SpriteSheetEnum } from "shared/enums";
import { useModal } from "shared/hooks";
import { MODAL_SPRITE_MAP } from "shared/consts";

export const HotBarItemsComponent: React.FC = () => {
  const { toggleModal } = useModal();

  return useMemo(
    () =>
      Object.values(Modal)
        .filter((id: number) => !isNaN(id))
        .map((modal: Modal) => (
          <SpriteComponent
            key={modal}
            spriteSheet={SpriteSheetEnum.UI}
            texture={MODAL_SPRITE_MAP[modal]}
            eventMode={EventMode.STATIC}
            cursor={Cursor.POINTER}
            onPointerDown={() => toggleModal(modal)}
          />
        )),
    [toggleModal],
  );
};
