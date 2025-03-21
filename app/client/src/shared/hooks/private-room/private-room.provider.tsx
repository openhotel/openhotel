import React, { ReactNode, useEffect } from "react";
import { PrivateRoomContext } from "shared/hooks/private-room/private-room.context";
import { Event, Route } from "shared/enums";
import { useModal, useProxy, useRouter } from "shared/hooks";
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
    addFurniture,
    removeFurniture,
    updateFurniture,
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
    const removeOnLeaveRoom = on(Event.LEAVE_ROOM, ({ moveToAnotherRoom }) => {
      !moveToAnotherRoom && navigate(Route.HOME);
      removeRoom();
    });

    return () => {
      removeOnPreJoinRoom();
      removeOnJoinRoom();
      removeOnLeaveRoom();
    };
  }, [on, emit, navigate, setRoom, removeRoom]);

  return (
    <PrivateRoomContext.Provider
      value={{
        users,
        room,
        addUser,
        removeUser,
        setUserPosition,
        addFurniture,
        removeFurniture,
        updateFurniture,
      }}
      children={children}
    />
  );
};
