import { Room } from "shared/types";
import { System } from "system/system";

export const rooms = () => {
  let $room: Room | null = null;
  let $preRoom: Room | null = null;

  const preload = async (room: Room) => {
    $preRoom = room;
    await System.game.furniture.loadFurniture(
      ...[...new Set(room.furniture.map(({ furnitureId }) => furnitureId))],
    );
  };

  const load = async (room: Room) => {
    $room = room;
    $preRoom = null;
  };

  const get = () => $room;
  const getPreRoom = () => $preRoom;

  const remove = () => {
    $room = null;
  };

  return {
    preload,
    load,
    get,
    getPreRoom,
    remove,
  };
};
