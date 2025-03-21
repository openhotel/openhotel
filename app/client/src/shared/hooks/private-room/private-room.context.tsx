import React from "react";
import { RoomFurniture, Point3d, PrivateRoom, User } from "shared/types";
import { Direction } from "shared/enums";

export type PrivateRoomState = {
  users: User[];
  room: PrivateRoom;

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
};

export const PrivateRoomContext =
  React.createContext<PrivateRoomState>(undefined);
