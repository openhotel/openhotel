import { Point3d, Room } from "shared/types";
import { TILE_Y_HEIGHT } from "shared/consts";
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
    if (!$room?.layout[point.x]) return null;
    const roomPoint = $room.layout[point.x][point.z];

    if (roomPoint === RoomPointEnum.EMPTY) return null;
    if (roomPoint === RoomPointEnum.SPAWN) return 0;

    const onStairs = stairsCalc ? getStairsFromPoint(point) : null;

    return (
      -(parseInt(roomPoint) - 1) * TILE_Y_HEIGHT +
      (onStairs ? TILE_Y_HEIGHT / 2 : 0)
    );
  };

  const getStairsFromPoint = (point: Partial<Point3d>): "x" | "z" | null => {
    if (!$room?.layout[point.x]) return null;
    const roomPoint = $room.layout[point.x][point.z];

    if (roomPoint > $room?.layout[point.x][point.z - 1]) return "x";
    if (roomPoint > $room?.layout[point.x - 1]?.[point.z]) return "z";

    return null;
  };

  return {
    set,
    get,

    getYFromPoint,
  };
};
