import { create } from "zustand";
import { Point3d, PrivateRoom, User } from "shared/types";
import { Direction } from "shared/enums";

export const usePrivateRoomStore = create<{
  room: PrivateRoom;
  setRoom: (room: PrivateRoom) => void;
  removeRoom: () => void;

  users: User[];
  addUser: (user: User) => void;
  removeUser: (accountId: string) => void;

  setUserPosition: (
    accountId: string,
    position: Point3d,
    bodyDirection?: Direction,
  ) => void;
}>((set) => ({
  room: null,
  setRoom: (room: PrivateRoom) => set((store) => ({ ...store, room })),
  removeRoom: () =>
    set({
      room: null,
      users: [],
    }),

  users: [],
  addUser: (user: User) =>
    set((store) => ({
      ...store,
      users: [...store.users, user],
    })),
  removeUser: (accountId: string) =>
    set((store) => ({
      ...store,
      users: store.users.filter((user) => user.accountId !== accountId),
    })),

  setUserPosition: (
    accountId: string,
    position: Point3d,
    bodyDirection: Direction,
  ) =>
    set((store) => ({
      ...store,
      users: store.users.map((user) =>
        user.accountId === accountId
          ? {
              ...user,
              position,
              bodyDirection: bodyDirection ?? user.bodyDirection,
              positionUpdatedAt: Date.now(),
            }
          : user,
      ),
    })),
}));
