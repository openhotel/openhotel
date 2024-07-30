import { Point3d, Room } from "shared/types";
import { RoomPointEnum } from "shared/enums";

export const rooms = () => {
  let $room: Room | null = null;

  const set = (room: Room) => {
    $room = room;
  };

  const get = () => $room;

  const getYFromPoint = (
    point: Partial<Point3d>,
    stairsCalc: boolean = false,
  ): number | null => {
    if (!$room?.layout[point.z]) return null;
    const roomPoint = $room.layout[point.z][point.x];

    if (roomPoint === RoomPointEnum.EMPTY) return null;
    if (roomPoint === RoomPointEnum.SPAWN) return 0;

    const onStairs = stairsCalc ? getStairsFromPoint(point) : null;

    return -(parseInt(roomPoint) - 1) + (onStairs ? 0.5 : 0);
  };

  const getStairsFromPoint = (point: Partial<Point3d>): "x" | "z" | null => {
    if (!$room?.layout[point.z]) return null;
    const roomPoint = $room.layout[point.z][point.x];

    if (roomPoint > $room?.layout[point.z][point.x - 1]) return "z";
    if (roomPoint > $room?.layout[point.z - 1]?.[point.x]) return "x";

    return null;
  };

  return {
    set,
    get,

    getYFromPoint,
  };
};
