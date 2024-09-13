import { Room } from "shared/types";

export const rooms = () => {
  let $room: Room | null = null;

  const set = (room: Room) => {
    $room = room;
  };

  const get = () => $room;

  const remove = () => {
    $room = null;
  };

  return {
    set,
    get,
    remove,
  };
};
