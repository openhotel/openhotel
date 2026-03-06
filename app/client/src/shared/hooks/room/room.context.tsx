import React from "react";
import { Point2d, Point3d, RoomPreview, Room, User } from "shared/types";
import { CrossDirection, Direction } from "shared/enums";

export type PositionData = {
  position: Point3d;
  wallPosition?: Point2d;
  direction?: CrossDirection;
};

export type RoomState<RoomType extends Room> = {
  room: RoomType;
  updateRoom: (room: RoomType) => void;

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

  selectedPreview: RoomPreview | null;
  setSelectedPreview: (data: RoomPreview | null) => void;

  lastPositionData: PositionData | null;
  setLastPositionData: (data: PositionData | null) => void;

  absoluteRoomPosition: Point2d | null;
  setAbsoluteRoomPosition: (point: Point2d | null) => void;
};

export const RoomContext = React.createContext<RoomState<Room>>(undefined);
