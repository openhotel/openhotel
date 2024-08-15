import { Point3d, RoomFurniture, User } from "shared/types/main.ts";
import { Direction, ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";

type BaseRoom = {
  id: string;
  title: string;
  description: string;
};

export type RawRoom = BaseRoom & {
  layout: string[];
  furniture: RoomFurniture[];
};

export type Room = BaseRoom & {
  layout: RoomPoint[][];
  furniture: RoomFurniture[];
  spawnPoint: Point3d;
  spawnDirection: Direction;
};

export type RoomPoint = number | string | RoomPointEnum;

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
  removeFurniture: (furniture: RoomFurniture) => void;
  getFurnitures: () => RoomFurniture[];

  getObject: () => Room;

  emit: <Data extends any>(event: ProxyEvent, data?: Data) => void;
};
