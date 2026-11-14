import { create } from "zustand";
import {
  Point2d,
  Point3d,
  PrivateRoom,
  Room,
  RoomMessage,
  RoomPreview,
  User,
} from "shared/types";
import { Direction } from "shared/enums";
import { PositionData } from "./room.context";

export const useRoomStore = create<{
  room: Room;
  messages: RoomMessage[];

  setRoom: (room: Room) => void;
  removeRoom: () => void;

  addUser: (user: User) => void;
  removeUser: (accountId: string) => void;
  setUserPosition: (
    accountId: string,
    position: Point3d,
    bodyDirection?: Direction,
  ) => void;
  setUserTargetPosition: (
    accountId: string,
    position: Point3d,
    bodyDirection: Direction,
  ) => void;
  //
  selectedPreview: RoomPreview | null;
  setSelectedPreview: (data: RoomPreview | null) => void;

  lastPositionData: PositionData | null;
  setLastPositionData: (data: PositionData | null) => void;

  absoluteRoomPosition: Point2d | null;
  setAbsoluteRoomPosition: (point: Point2d | null) => void;
}>((set) => ({
  room: null,
  messages: [],
  setRoom: (room: PrivateRoom) =>
    set((store) => ({ ...store, room, messages: [] })),
  removeRoom: () =>
    set({
      room: null,
      messages: [],
      lastPositionData: null,
    }),

  //////////////////
  addUser: (user: User) =>
    set((store) => ({
      ...store,
      room: {
        ...store.room,
        users: [...store.room.users, user],
      },
    })),
  removeUser: (accountId: string) =>
    set((store) => ({
      ...store,
      room: {
        ...store.room,
        users: store.room.users.filter((user) => user.accountId !== accountId),
      },
    })),

  setUserPosition: (
    accountId: string,
    position: Point3d,
    bodyDirection: Direction,
  ) =>
    set((store) => ({
      ...store,
      room: {
        ...store.room,
        users: store.room.users.map((user) =>
          user.accountId === accountId
            ? {
                ...user,
                position,
                bodyDirection: bodyDirection ?? user.bodyDirection,
                targetPosition: null,
                positionUpdatedAt: Date.now(),
              }
            : user,
        ),
      },
    })),

  setUserTargetPosition: (
    accountId: string,
    targetPosition: Point3d,
    bodyDirection: Direction,
  ) =>
    set((store) => ({
      ...store,
      room: {
        ...store.room,
        users: store.room.users.map((user) =>
          user.accountId === accountId
            ? {
                ...user,
                position: user.targetPosition ?? user.position,
                targetPosition,
                bodyDirection: bodyDirection ?? user.bodyDirection,
              }
            : user,
        ),
      },
    })),
  //
  selectedPreview: null,
  setSelectedPreview: (selectedPreview: RoomPreview | null) =>
    set((store) => ({
      ...store,
      selectedPreview,
    })),
  //
  lastPositionData: null,
  setLastPositionData: (lastPositionData: PositionData | null) =>
    set((store) => ({
      ...store,
      lastPositionData,
    })),
  //
  absoluteRoomPosition: null,
  setAbsoluteRoomPosition: (point: Point2d | null) =>
    set((store) => ({
      ...store,
      absoluteRoomPosition: point,
    })),
}));
