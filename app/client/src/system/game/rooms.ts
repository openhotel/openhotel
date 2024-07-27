import { Point3d, Room } from "shared/types";
import { TILE_Y_HEIGHT } from "shared/consts";
import { RoomPointEnum } from "shared/enums";

export const rooms = () => {
  let $room: Room | null = null;

  const set = (room: Room) => {
    $room = room;
  };

  const get = () => $room;

  const getYFromPoint = (point: Partial<Point3d>): number | null => {
    if (!$room?.layout[point.x]) return null;
    const roomPoint = $room.layout[point.x][point.z];

    if (roomPoint === RoomPointEnum.EMPTY) return null;
    if (roomPoint === RoomPointEnum.SPAWN) return 0;

    return -(parseInt(roomPoint) - 1) * TILE_Y_HEIGHT;
  };

  return {
    set,
    get,

    getYFromPoint,
  };
};
