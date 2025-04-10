import React, { useCallback, useEffect, useMemo } from "react";
import { CharacterComponent } from "shared/components";
import {
  CharacterArmAction,
  CharacterBodyAction,
  Event as ProxyEvent,
  PrivateRoomPreviewType,
} from "shared/enums";
import { usePrivateRoom, useProxy } from "shared/hooks";
import { User } from "shared/types";

export const RoomCharactersComponent: React.FC = () => {
  const { on, emit } = useProxy();
  const { room, addUser, removeUser, setUserPosition, setSelectedPreview } =
    usePrivateRoom();

  useEffect(() => {
    if (!room) return;

    const removeOnAddHuman = on(ProxyEvent.ADD_HUMAN, ({ user }) => {
      addUser(user);
    });
    const removeOnRemoveHuman = on(ProxyEvent.REMOVE_HUMAN, ({ accountId }) => {
      removeUser(accountId);
    });

    const removeOnMoveHuman = on(
      ProxyEvent.MOVE_HUMAN,
      ({ accountId, position, bodyDirection }) => {
        setUserPosition(accountId, position, bodyDirection);
      },
    );

    const removeOnSetPositionHuman = on(
      ProxyEvent.SET_POSITION_HUMAN,
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
  }, [room, on, emit, addUser, removeUser, setUserPosition]);

  const onPointerDown = useCallback(
    (user: User) => () => {
      setSelectedPreview({
        id: user.accountId,
        type: PrivateRoomPreviewType.CHARACTER,
        data: user,
        title: user.username,
      });
    },
    [setSelectedPreview],
  );

  return useMemo(
    () =>
      room.users.map((user) => (
        <CharacterComponent
          key={user.accountId}
          bodyAction={CharacterBodyAction.IDLE}
          bodyDirection={user.bodyDirection}
          headDirection={user.bodyDirection}
          leftArmAction={CharacterArmAction.IDLE}
          rightArmAction={CharacterArmAction.IDLE}
          skinColor={user.skinColor ?? 0xefcfb1}
          position={user.position}
          onPointerDown={onPointerDown(user)}
        />
      )),
    [room.users],
  );
};
