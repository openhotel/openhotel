import {
  BaseRoom,
  BaseRoomMutable,
  RoomFurniture,
  RoomPoint,
} from "shared/types/main.ts";
import { Point3d, Direction } from "@oh/utils";

export type PrivateRoom = BaseRoom & {
  type: "private";

  ownerId: string;
  layout: RoomPoint[][];
  furniture: RoomFurniture[];
  spawnPoint: Point3d;
  spawnDirection: Direction;
  maxUsers: number;
};

export type PrivateRoomMutable = BaseRoomMutable & {
  type: "private";

  getOwnerId: () => string;
  getOwnerUsername: () => Promise<string | null>;

  addFurniture: (furniture: RoomFurniture) => Promise<void>;
  updateFurniture: (furniture: RoomFurniture) => Promise<void>;
  removeFurniture: (furniture: RoomFurniture) => Promise<void>;
  getFurniture: () => RoomFurniture[];

  getObject: () => PrivateRoom;
};
