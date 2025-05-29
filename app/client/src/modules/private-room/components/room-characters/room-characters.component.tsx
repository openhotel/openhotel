import React, { useCallback, useEffect, useMemo } from "react";
import { RoomCharacterComponent } from "../";
import { Event as ProxyEvent, PrivateRoomPreviewType } from "shared/enums";
import { usePrivateRoom, useProxy } from "shared/hooks";
import { User } from "shared/types";

type Props = {
  disableHitAreas?: boolean;
};

export const RoomCharactersComponent: React.FC<Props> = ({
  disableHitAreas = false,
}) => {
  const { on } = useProxy();
  const {
    room,
    addUser,
    removeUser,
    setUserPosition,
    setSelectedPreview,
    setUserTargetPosition,
  } = usePrivateRoom();

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
        const user = room.users.find((u) => u.accountId === accountId);
        if (!user) return;

        setUserTargetPosition(accountId, position, bodyDirection);
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
  }, [room, on, addUser, removeUser, setUserPosition, setUserTargetPosition]);

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
        <RoomCharacterComponent
          key={user.accountId}
          user={user}
          onPointerDown={onPointerDown(user)}
          disableHitArea={disableHitAreas}
        />
      )),
    [room.users, disableHitAreas],
  );
};
