import React, { useCallback, useEffect } from "react";
import {
  CharacterComponent,
  FurnitureComponent,
  PrivateRoomComponent as PrivateRoomComp,
} from "shared/components";

import {
  ContainerComponent,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { usePrivateRoom, useProxy, useRouter } from "shared/hooks";
import { Point3d } from "shared/types";
import { CharacterArmAction, CharacterBodyAction, Event } from "shared/enums";
import { ChatHotBarComponent } from "modules/private-room";

type Props = {};

export const PrivateRoomComponent: React.FC<Props> = () => {
  const { on, emit } = useProxy();
  const { navigate } = useRouter();
  const { room, users, addUser, removeUser, setUserPosition } =
    usePrivateRoom();

  const onPointerTile = useCallback(
    (position: Point3d) => {
      emit(Event.POINTER_TILE, {
        position,
      });
    },
    [emit],
  );

  useEffect(() => {
    const removeOnAddHuman = on(Event.ADD_HUMAN, ({ user }) => {
      addUser(user);
    });
    const removeOnRemoveHuman = on(Event.REMOVE_HUMAN, ({ accountId }) => {
      removeUser(accountId);
    });

    const removeOnMoveHuman = on(
      Event.MOVE_HUMAN,
      ({ accountId, position, bodyDirection }) => {
        setUserPosition(accountId, position, bodyDirection);
      },
    );

    const removeOnSetPositionHuman = on(
      Event.SET_POSITION_HUMAN,
      ({ accountId, position }) => {
        setUserPosition(accountId, position);
      },
    );

    return () => {
      removeOnAddHuman();
      removeOnRemoveHuman();
      removeOnMoveHuman();
      removeOnSetPositionHuman();
    };
  }, [on, emit, navigate, addUser, removeUser, setUserPosition]);

  if (!room) return null;

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
              position={user.position}
            />
          ))}
          <FurnitureComponent position={{ x: 3, y: 0, z: 4 }} />
          <FurnitureComponent position={{ x: 4, y: 0, z: 4 }} />
          <FurnitureComponent position={{ x: 4, y: 1, z: 4 }} />
        </PrivateRoomComp>
      </FlexContainerComponent>
      <ChatHotBarComponent />
    </ContainerComponent>
  );
};
