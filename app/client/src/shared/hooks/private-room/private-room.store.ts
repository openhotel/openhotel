import { create } from "zustand";
import {
  Point2d,
  Point3d,
  PrivateRoom,
  PrivateRoomPreview,
  RoomFurniture,
  RoomMessage,
  User,
} from "shared/types";
import { Direction } from "shared/enums";
import { PositionData } from "shared/hooks/private-room/private-room.context";

export const usePrivateRoomStore = create<{
  room: PrivateRoom;
  messages: RoomMessage[];

  setRoom: (room: PrivateRoom) => void;
  removeRoom: () => void;

  //
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
  addFurniture: (furniture: RoomFurniture) => void;
  updateFurniture: (furniture: RoomFurniture) => void;
  removeFurniture: (furniture: RoomFurniture) => void;

  //
  selectedPreview: PrivateRoomPreview | null;
  setSelectedPreview: (data: PrivateRoomPreview | null) => void;

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
      selectedPreview: null,
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
  /////////////////
  addFurniture: (furniture: RoomFurniture) =>
    set((store) => ({
      ...store,
      room: {
        ...store.room,
        furniture: [...store.room.furniture, furniture],
      },
    })),
  removeFurniture: (furniture: RoomFurniture) =>
    set((store) => ({
      ...store,
      room: {
        ...store.room,
        furniture: store.room.furniture.filter(
          ($furniture) => $furniture.id !== furniture.id,
        ),
      },
    })),
  updateFurniture: (furniture: RoomFurniture) =>
    set((store) => ({
      ...store,
      room: {
        ...store.room,
        furniture: store.room.furniture.map(($furniture) =>
          $furniture.id === furniture.id ? furniture : $furniture,
        ),
      },
    })),
  ///////
  selectedPreview: null,
  setSelectedPreview: (selectedPreview: PrivateRoomPreview | null) =>
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
