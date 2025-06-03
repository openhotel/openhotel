import {
  BaseRoom,
  BaseRoomMutable,
  RoomFurniture,
  RoomPoint,
  User,
} from "shared/types/main.ts";
import { Point3d } from "@oh/utils";
import { FurnitureType } from "shared/enums/furniture.enum.ts";

export type PrivateRoom = BaseRoom & {
  type: "private";

  ownerId: string;
  layoutIndex: number;
  furniture: RoomFurniture[];
  maxUsers: number;

  createdAt: number;
  updatedAt: number;
};

export type PrivateRoomMutable = BaseRoomMutable & {
  type: "private";

  getOwnerId: () => string;
  getOwnerUsername: () => Promise<string | null>;

  addFurniture: (furniture: RoomFurniture) => Promise<void>;
  updateFurniture: (furniture: RoomFurniture) => Promise<void>;
  removeFurniture: (furniture: RoomFurniture) => Promise<void>;
  removeAllFurniture: () => Promise<void>;
  getFurniture: () => RoomFurniture[];

  getLayout: () => RoomPoint[][];

  getFurnitureFromPoint: (point: Omit<Point3d, "y">) => RoomFurniture[];

  getFurnitureYPosition: (
    position: Point3d,
    furnitureType: FurnitureType,
    currentId?: string,
  ) => Promise<number | null>;

  getObject: () => PrivateRoom;
  getObjectWithUsers: () => Promise<
    PrivateRoom & {
      users: Partial<User>[];
      ownerUsername: string;
    }
  >;

  remove: () => Promise<void>;
};
