import React, { ReactNode, useEffect } from "react";
import { PrivateRoomContext } from "shared/hooks/private-room/private-room.context";
import { Event, Route } from "shared/enums";
import { useProxy, useModal, useRouter } from "shared/hooks";
import { usePrivateRoomStore } from "./private-room.store";
import { PrivateRoom } from "shared/types";

type PrivateRoomProps = {
  children: ReactNode;
};

export const PrivateRoomProvider: React.FunctionComponent<PrivateRoomProps> = ({
  children,
}) => {
  const {
    setRoom,
    removeRoom,
    addUser,
    removeUser,
    users,
    room,
    setUserPosition,
  } = usePrivateRoomStore();

  const { on, emit } = useProxy();
  const { closeAll } = useModal();
  const { navigate } = useRouter();

  useEffect(() => {
    const removeOnPreJoinRoom = on(Event.PRE_JOIN_ROOM, ({ room }) => {
      emit(Event.JOIN_ROOM, { roomId: room.id });
    });
    const removeOnJoinRoom = on(
      Event.LOAD_ROOM,
      ({ room }: { room: PrivateRoom }) => {
        setRoom(room);
        navigate(Route.PRIVATE_ROOM);
        closeAll();
      },
    );
    const removeOnLeaveRoom = on(Event.LEAVE_ROOM, (data) => {
      navigate(null);
      removeRoom();
    });
    const removeOnAddHuman = on(Event.ADD_HUMAN, ({ user }) => {
      addUser(user);
    });
    const removeOnRemoveHuman = on(Event.REMOVE_HUMAN, ({ accountId }) => {
      removeUser(accountId);
    });

    const removeOnMoveHuman = on(
      Event.MOVE_HUMAN,
      ({ accountId, position }) => {
        setUserPosition(accountId, position);
      },
    );

    return () => {
      removeOnPreJoinRoom();
      removeOnJoinRoom();
      removeOnLeaveRoom();
      removeOnAddHuman();
      removeOnRemoveHuman();
      removeOnMoveHuman();
    };
  }, [
    on,
    emit,
    navigate,
    setRoom,
    removeRoom,
    addUser,
    removeUser,
    setUserPosition,
  ]);

  return (
    <PrivateRoomContext.Provider
      value={{
        users,
        room,
      }}
      children={children}
    />
  );
};
