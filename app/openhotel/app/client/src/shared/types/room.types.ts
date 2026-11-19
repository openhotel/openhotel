import { PrivateRoomPreviewType } from "shared/enums";
import { FurnitureData, RoomFurniture } from "shared/types/furniture.types";
import { User } from "shared/types/user.types";
import { CrossDirection } from "@shared/enums/direction.enums.ts";
import { Point, Point3d } from "@shared/types/point.types.ts";
import { RoomPoint } from "@shared/types/room.types.ts";

//@ignore-duplicate
export type BaseRoom = {
  type: "public" | "private";

  version: number;
  id: string;

  title: string;
  description: string;

  layout: RoomPoint[][];
  spawnPoint: Point3d;
  users: User[];

  maxUsers: number;
};

// @ignore-duplicate
export type PrivateRoom = BaseRoom & {
  type: "private";
  ownerId: string;
  ownerUsername: string | null;

  furniture: RoomFurniture[];
};

export type PublicRoom = BaseRoom & {
  type: "public";
};

// @ignore-duplicate
export type Room = PrivateRoom | PublicRoom;

export type RoomMessage = {
  id: string;
  visible?: boolean;
  accountId: string | null;
  username: string | null;
  color?: number;
  usernameColor?: number;
  backgroundColor?: number;
  messageColor?: number;
  position: Point;
  message: string;
};

export type RoomPreview = {
  id: string;
  type: PrivateRoomPreviewType;
  data: any | FurnitureData;
  title: string;
  direction?: CrossDirection;
  state?: string;
};

export type NavigatorRoom = {
  id: string;
  title: string;
  description: string;
  ownerUsername: string;
  ownerId: string;
  users: number;
  maxUsers: number;
  favorite: boolean;
  layoutIndex: number;
};
