import { PrivateRoomMutable, PrivateRoom } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { getRandomNumber } from "@oh/utils";
import { getRoom } from "./room.ts";

export const $private = () => {
  let roomUserMap: Record<string, string[]> = {};

  const $getRoom = getRoom(roomUserMap);

  const load = () => {};

  const get = async (roomId: string): Promise<PrivateRoomMutable | null> => {
    try {
      const roomData = await System.db.get(["rooms", "private", roomId]);
      if (!roomData) return null;
      return await $getRoom(roomData);
    } catch (e) {
      return null;
    }
  };

  const getList = async (): Promise<PrivateRoomMutable[]> => {
    const { items } = await System.db.list({ prefix: ["rooms", "private"] });
    return await Promise.all(items.map((item) => $getRoom(item.value)));
  };

  const getByName = async (
    name: string,
  ): Promise<PrivateRoomMutable | null> => {
    const roomList = await getList();
    return roomList.find((room) => room.getTitle() === name) || null;
  };

  const getRandom = async (): Promise<PrivateRoomMutable> => {
    const roomList = await getList();
    const roomIndex = getRandomNumber(0, roomList.length - 1);
    return roomList[roomIndex];
  };

  const add = async (room: PrivateRoom) => {
    await System.db.set(["rooms", "private", room.id], room);
  };
  return {
    load,

    get,
    getList,
    getByName,

    getRandom,

    add,
  };
};
