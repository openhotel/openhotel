import React from "react";
import {
  RoomFurniture,
  Point3d,
  PrivateRoom,
  User,
  PrivateRoomPreview,
} from "shared/types";
import { Direction } from "shared/enums";

export type PrivateRoomState = {
  room: PrivateRoom;

  addUser: (user: User) => void;
  getUser: (data: { accountId?: string; username?: string }) => User | null;
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
  setUserBodyDirection: (accountId: string, bodyDirection: Direction) => void;

  addFurniture: (furniture: RoomFurniture) => void;
  updateFurniture: (furniture: RoomFurniture) => void;
  removeFurniture: (furniture: RoomFurniture) => void;

  selectedPreview: PrivateRoomPreview | null;
  setSelectedPreview: (data: PrivateRoomPreview | null) => void;
};

export const PrivateRoomContext =
  React.createContext<PrivateRoomState>(undefined);
