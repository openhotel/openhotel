import React from "react";
import {
  RoomFurniture,
  Point3d,
  PrivateRoom,
  User,
  PrivateRoomPreview,
  Point2d,
} from "shared/types";
import { CrossDirection, Direction } from "shared/enums";

export type PositionData = {
  position: Point3d;
  wallPosition?: Point2d;
  direction?: CrossDirection;
};

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

  addFurniture: (furniture: RoomFurniture) => void;
  updateFurniture: (furniture: RoomFurniture) => void;
  removeFurniture: (furniture: RoomFurniture) => void;

  selectedPreview: PrivateRoomPreview | null;
  setSelectedPreview: (data: PrivateRoomPreview | null) => void;

  lastPositionData: PositionData | null;
  setLastPositionData: (data: PositionData | null) => void;

  absoluteRoomPosition: Point2d | null;
  setAbsoluteRoomPosition: (point: Point2d | null) => void;
};

export const PrivateRoomContext =
  React.createContext<PrivateRoomState>(undefined);
