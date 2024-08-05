import { Point3d, RoomFurniture, User } from "shared/types/main.ts";
import { ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";

type BaseRoom = {
  id: string;
  title: string;
  description: string;
};

export type RawRoom = BaseRoom & {
  layout: string[];
};

export type Room = BaseRoom & {
  layout: RoomPoint[][];
  spawnPoint: Point3d;
  furniture: RoomFurniture[];
};

export type RoomPoint = number | RoomPointEnum;

export type RoomMutable = {
  getId: () => string;
  getTitle: () => string;
  getDescription: () => string;

  addUser: (user: User) => void;
  removeUser: (user: User) => void;
  getUsers: () => string[];

  getPoint: (point: Point3d) => RoomPoint;
  isPointFree: (point: Point3d, userId?: string) => boolean;
  findPath: (start: Point3d, endPoint: Point3d, userId?: string) => Point3d[];

  addFurniture: (furniture: RoomFurniture) => void;

  getObject: () => Room;

  emit: <Data extends any>(event: ProxyEvent, data?: Data) => void;
};
