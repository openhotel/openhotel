import React from "react";
import { RoomPreview, Room, User } from "shared/types";
import { CrossDirection, Direction } from "@shared/enums/direction.enums.ts";
import { Point, Point3d } from "@shared/types/point.types.ts";

export type PositionData = {
  position: Point3d;
  wallPosition?: Point;
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

  absoluteRoomPosition: Point | null;
  setAbsoluteRoomPosition: (point: Point | null) => void;
};

export const RoomContext = React.createContext<RoomState<Room>>(undefined);
