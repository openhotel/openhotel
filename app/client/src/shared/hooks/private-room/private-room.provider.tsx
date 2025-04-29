import React, { ReactNode, useCallback, useEffect } from "react";
import { PrivateRoomContext } from "shared/hooks/private-room/private-room.context";
import { Direction, Event, Route } from "shared/enums";
import { useModal, useProxy, useRouter } from "shared/hooks";
import { usePrivateRoomStore } from "./private-room.store";
import { Point3d, PrivateRoom, RoomFurniture, User } from "shared/types";

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
    room,
    setUserPosition,
    setUserTargetPosition,
    addFurniture,
    removeFurniture,
    updateFurniture,
    selectedPreview,
    setSelectedPreview,
    lastPositionData,
    setLastPositionData,
    absoluteRoomPosition,
    setAbsoluteRoomPosition,
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

  const $addUser = useCallback(
    (user: User) => room && addUser(user),
    [addUser, room],
  );
  const getUser = useCallback(
    ({ accountId, username }: { accountId?: string; username?: string }) => {
      return room.users.find(
        (user) => user.accountId === accountId || user.username === username,
      );
    },
    [room?.users],
  );
  const $removeUser = useCallback(
    (accountId: string) => room && removeUser(accountId),
    [removeUser, room],
  );
  const $setUserPosition = useCallback(
    (accountId: string, position: Point3d, bodyDirection?: Direction) =>
      room && setUserPosition(accountId, position, bodyDirection),
    [setUserPosition, room],
  );
  const $setUserTargetPosition = useCallback(
    (accountId: string, position: Point3d, bodyDirection?: Direction) =>
      room && setUserTargetPosition(accountId, position, bodyDirection),
    [setUserPosition, room],
  );
  const $addFurniture = useCallback(
    (furniture: RoomFurniture) => room && addFurniture(furniture),
    [addFurniture, room],
  );
  const $removeFurniture = useCallback(
    (furniture: RoomFurniture) => room && removeFurniture(furniture),
    [removeFurniture, room],
  );
  const $updateFurniture = useCallback(
    (furniture: RoomFurniture) => room && updateFurniture(furniture),
    [updateFurniture, room],
  );

  return (
    <PrivateRoomContext.Provider
      value={{
        room,
        addUser: $addUser,
        getUser,
        removeUser: $removeUser,
        setUserPosition: $setUserPosition,
        setUserTargetPosition: $setUserTargetPosition,
        addFurniture: $addFurniture,
        removeFurniture: $removeFurniture,
        updateFurniture: $updateFurniture,
        selectedPreview,
        setSelectedPreview,
        lastPositionData,
        setLastPositionData,
        absoluteRoomPosition,
        setAbsoluteRoomPosition,
      }}
      children={children}
    />
  );
};
