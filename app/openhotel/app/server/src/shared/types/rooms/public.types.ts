import { FindPathProps, BaseRoomMutable, BaseRoom } from "shared/types/main.ts";
import { Point3d } from "@shared/types/point.types.ts";
import { Direction } from "@shared/enums/direction.enums.ts";
import { RoomPoint } from "@shared/types/room.types.ts";

//@ignore-duplicate
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
