import {
  FindPathProps,
  RoomPoint,
  BaseRoomMutable,
  BaseRoom,
} from "shared/types/main.ts";
import { Point3d, Direction } from "@oh/utils";

export type PublicRoom = BaseRoom & {
  type: "public";

  layout: RoomPoint[][];
  spawnPoint: Point3d;
  spawnDirection: Direction;
  maxUsers: number;
};

export type PublicRoomMutable = BaseRoomMutable & {
  type: "public";

  getPoint: (point: Point3d) => RoomPoint;
  isPointFree: (
    point: Point3d,
    props?: { accountId?: string; withoutSpawn?: boolean },
  ) => boolean;
  findPath: (props: FindPathProps) => Point3d[];

  getLayers: () => string[];

  getObject: () => PublicRoom;
};
