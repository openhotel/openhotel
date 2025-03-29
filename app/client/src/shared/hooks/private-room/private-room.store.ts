import { create } from "zustand";
import { Point3d, PrivateRoom, RoomFurniture, User } from "shared/types";
import { Direction } from "shared/enums";

export const usePrivateRoomStore = create<{
  room: PrivateRoom;
  setRoom: (room: PrivateRoom) => void;
  removeRoom: () => void;

  addUser: (user: User) => void;
  removeUser: (accountId: string) => void;

  setUserPosition: (
    accountId: string,
    position: Point3d,
    bodyDirection?: Direction,
  ) => void;

  addFurniture: (furniture: RoomFurniture) => void;
  updateFurniture: (furniture: RoomFurniture) => void;
  removeFurniture: (furniture: RoomFurniture) => void;
}>((set) => ({
  room: null,
  setRoom: (room: PrivateRoom) => set((store) => ({ ...store, room })),
  removeRoom: () =>
    set({
      room: null,
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
}));
