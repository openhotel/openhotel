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
  const $addFurniture = useCallback(
    (furniture: RoomFurniture) => addFurniture(furniture),
    [addFurniture],
  );
  const $removeFurniture = useCallback(
    (furniture: RoomFurniture) => removeFurniture(furniture),
    [removeFurniture],
  );
  const $updateFurniture = useCallback(
    (furniture: RoomFurniture) => updateFurniture(furniture),
    [updateFurniture],
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
