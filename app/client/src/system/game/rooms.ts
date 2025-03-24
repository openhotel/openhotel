import { BaseRoom } from "shared/types";
export const rooms = () => {
  let $room: BaseRoom | null = null;
  let $preRoom: BaseRoom | null = null;

  const preload = async (room: BaseRoom) => {
    $preRoom = room;
  };

  const load = async (room: BaseRoom) => {
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
