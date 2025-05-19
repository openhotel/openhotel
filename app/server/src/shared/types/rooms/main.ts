import { RoomPointEnum } from "shared/enums/room.enums.ts";
import { Point3d } from "@oh/utils";
import { User } from "shared/types/user.types.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import {
  PrivateRoom,
  PrivateRoomMutable,
} from "shared/types/rooms/private.types.ts";
import {
  PublicRoom,
  PublicRoomMutable,
} from "shared/types/rooms/public.types.ts";

export * from "./private.types.ts";
export * from "./public.types.ts";

export type RoomPoint = number | string | RoomPointEnum;

export type FindPathProps = {
  start: Point3d;
  end: Point3d;
  accountId?: string;
};

export type BaseRoom = {
  type: "public" | "private";

  version: number;
  id: string;
  title: string;
  description: string;
};

export type BaseRoomMutable = {
  type: "public" | "private";

  getId: () => string;
  getTitle: () => string;
  getDescription: () => string;

  getYFromPoint: (point: Point3d) => number | null;

  addUser: (user: User, position?: Point3d) => Promise<void>;
  removeUser: (user: User, moveToAnotherRoom?: boolean) => void;
  getUsers: () => string[];

  getPoint: (point: Point3d) => RoomPoint;
  isPointFree: (
    point: Point3d,
    props?: { accountId?: string; withoutSpawn?: boolean },
  ) => boolean;
  findPath: (props: FindPathProps) => Point3d[];

  emit: <Data extends any>(event: ProxyEvent, data?: Data) => void;
};

export type Room = PrivateRoom | PublicRoom;
export type RoomMutable = PrivateRoomMutable | PublicRoomMutable;
