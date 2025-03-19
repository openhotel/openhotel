import React, { useCallback } from "react";
import { PrivateRoomComponent as PrivateRoomComp } from "shared/components";

import {
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { usePrivateRoom, useProxy } from "shared/hooks";
import { Point3d } from "shared/types";
import { CharacterArmAction, CharacterBodyAction, Event } from "shared/enums";
import { CharacterComponent } from "shared/components";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {};

export const PrivateRoomComponent: React.FC<Props> = () => {
  const { emit } = useProxy();
  const { room, users } = usePrivateRoom();

  const onPointerTile = useCallback(
    (position: Point3d) => {
      console.log(position);
      emit(Event.POINTER_TILE, {
        position,
      });
    },
    [emit],
  );

  return (
    <FlexContainerComponent
      justify={FLEX_JUSTIFY.CENTER}
      align={FLEX_ALIGN.CENTER}
    >
      <PrivateRoomComp {...room} onPointerTile={onPointerTile}>
        {users.map((user) => (
          <CharacterComponent
            key={user.accountId}
            bodyAction={CharacterBodyAction.IDLE}
            bodyDirection={user.bodyDirection}
            headDirection={user.bodyDirection}
            leftArmAction={CharacterArmAction.ARM_WAVE_0}
            rightArmAction={CharacterArmAction.IDLE}
            skinColor={user.skinColor ?? 0xefcfb1}
            zIndex={user.position.x + user.position.z}
            position={getPositionFromIsometricPosition(user.position)}
          />
        ))}
      </PrivateRoomComp>
    </FlexContainerComponent>
  );
};
