import React, { useCallback } from "react";
import {
  CharacterComponent,
  PrivateRoomComponent as PrivateRoomComp,
} from "shared/components";

import {
  ContainerComponent,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { usePrivateRoom, useProxy } from "shared/hooks";
import { Point3d } from "shared/types";
import { CharacterArmAction, CharacterBodyAction, Event } from "shared/enums";
import { getPositionFromIsometricPosition } from "shared/utils";
import { ChatHotBarComponent } from "modules/private-room/components";

type Props = {};

export const PrivateRoomComponent: React.FC<Props> = () => {
  const { emit } = useProxy();
  const { room, users } = usePrivateRoom();

  const onPointerTile = useCallback(
    (position: Point3d) => {
      emit(Event.POINTER_TILE, {
        position,
      });
    },
    [emit],
  );

  return (
    <ContainerComponent>
      <FlexContainerComponent>
        <PrivateRoomComp {...room} onPointerTile={onPointerTile}>
          {users.map((user) => (
            <CharacterComponent
              key={user.accountId}
              bodyAction={CharacterBodyAction.IDLE}
              bodyDirection={user.bodyDirection}
              headDirection={user.bodyDirection}
              leftArmAction={CharacterArmAction.IDLE}
              rightArmAction={CharacterArmAction.IDLE}
              skinColor={user.skinColor ?? 0xefcfb1}
              zIndex={user.position.x + user.position.z + 0.5}
              position={getPositionFromIsometricPosition(user.position)}
            />
          ))}
        </PrivateRoomComp>
      </FlexContainerComponent>
      <ChatHotBarComponent />
    </ContainerComponent>
  );
};
