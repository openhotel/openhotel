import React, { ReactNode, useCallback, useEffect } from "react";
import { RoomContext } from "./room.context";
import { Direction, Event as ProxyEvent, Event, Route } from "shared/enums";
import { Point3d, Room, User } from "shared/types";
import { useProxy } from "../proxy";
import { useModal } from "../modal";
import { useRouter } from "../router";
import { useRoomStore } from "./room.store";

type TemplateProps = {
  children: ReactNode;
};

export const RoomProvider: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  const {
    setRoom,
    removeRoom,
    addUser,
    removeUser,
    room,
    setUserPosition,
    setUserTargetPosition,
    lastPositionData,
    setLastPositionData,
    selectedPreview,
    setSelectedPreview,
    absoluteRoomPosition,
    setAbsoluteRoomPosition,
  } = useRoomStore();

  const { on, emit } = useProxy();
  const { closeAll } = useModal();
  const { navigate } = useRouter();

  useEffect(() => {
    const removeOnPreJoinRoom = on(Event.PRE_JOIN_ROOM, ({ room }) => {
      emit(Event.JOIN_ROOM, { roomId: room.id });
    });
    const removeOnJoinRoom = on(Event.LOAD_ROOM, ({ room }: { room: Room }) => {
      setRoom(room);
      console.log(room);
      switch (room.type) {
        case "private":
          navigate(Route.PRIVATE_ROOM);
          closeAll();
          break;
        case "public":
          navigate(Route.PUBLIC_ROOM);
          closeAll();
          break;
      }
    });
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

  const updateRoom = useCallback((room: Room) => setRoom(room), [setRoom]);

  const $addUser = useCallback((user: User) => addUser(user), [addUser]);
  const getUser = useCallback(
    ({ accountId, username }: { accountId?: string; username?: string }) => {
      return room.users.find(
        (user) => user.accountId === accountId || user.username === username,
      );
    },
    [room?.users],
  );
  const $removeUser = useCallback(
    (accountId: string) => removeUser(accountId),
    [removeUser],
  );
  const $setUserPosition = useCallback(
    (accountId: string, position: Point3d, bodyDirection?: Direction) =>
      setUserPosition(accountId, position, bodyDirection),
    [setUserPosition],
  );
  const $setUserTargetPosition = useCallback(
    (accountId: string, position: Point3d, bodyDirection?: Direction) =>
      setUserTargetPosition(accountId, position, bodyDirection),
    [setUserTargetPosition],
  );

  return (
    <RoomContext.Provider
      value={{
        room,
        updateRoom,
        addUser: $addUser,
        getUser,
        removeUser: $removeUser,
        setUserPosition: $setUserPosition,
        setUserTargetPosition: $setUserTargetPosition,
        lastPositionData,
        setLastPositionData,
        selectedPreview,
        setSelectedPreview,
        absoluteRoomPosition,
        setAbsoluteRoomPosition,
      }}
      children={children}
    />
  );
};
