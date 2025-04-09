import { PrivateRoomPreviewType, RoomPointEnum } from "shared/enums";
import { Point2d, Point3d } from "./point.types";
import { RoomFurniture } from "shared/types/furniture.types";
import { User } from "shared/types/user.types";

export type RoomPoint = string | RoomPointEnum;

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

export type PrivateRoom = BaseRoom & {
  ownerId: string;
  ownerUsername: string | null;

  furniture: RoomFurniture[];
};

export type RoomMessage = {
  id: string;
  visible?: boolean;
  accountId: string | null;
  username: string | null;
  color?: number;
  backgroundColor?: number;
  messageColor?: number;
  position: Point2d;
  message: string;
};

export type PrivateRoomPreview = {
  type: PrivateRoomPreviewType;
  data: unknown;
  title: string;
};
