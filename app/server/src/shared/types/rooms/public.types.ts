import {
  FindPathProps,
  RoomPoint,
  BaseRoomMutable,
  BaseRoom,
} from "shared/types/main.ts";
import { Point3d, Direction } from "@oh/utils";

type PublicBaseRoom = BaseRoom & {
  type: "public";

  version: 1;
};

export type PublicRoom = PublicBaseRoom & {
  layout: RoomPoint[][];
  spawnPoint: Point3d;
  spawnDirection: Direction;
  maxUsers: number;
};

export type PublicRoomMutable = BaseRoomMutable & {
  type: "public";

  getPoint: (point: Point3d) => RoomPoint;
  isPointFree: (point: Point3d, accountId?: string) => boolean;
  findPath: (props: FindPathProps) => Point3d[];

  getLayers: () => unknown[];

  getObject: () => PublicRoom;
};
