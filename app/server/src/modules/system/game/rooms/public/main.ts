import { getRoom } from "./room.ts";
import { PublicRoomMutable } from "shared/types/rooms/public.types.ts";
import {
  getRoomSpawnDirection,
  getRoomSpawnPoint,
} from "shared/utils/rooms.utils.ts";

export const $public = () => {
  let roomUserMap: Record<string, string[]> = {};

  const $getRoom = getRoom(roomUserMap);

  const load = () => {};

  const get = async (roomId: string): Promise<PublicRoomMutable | null> => {
    return $getRoom({
      type: "public",
      version: 1,
      id: "01JM5ZKX5BCD1H3EWQS3Y657PP",
      title: "Public test",
      description: "This is a room to show all furnitures",
      layout: [],
      maxUsers: 100,
      spawnPoint: getRoomSpawnPoint([]),
      spawnDirection: getRoomSpawnDirection([]),
    });
  };
  const getList = async (): Promise<PublicRoomMutable[]> => {
    return [await get(null)];
  };

  // const getList = async (): Promise<PrivateRoomMutable[]> => {
  //   return (await System.db.list({ prefix: ["rooms", "private"] })).map(
  //     (item) => $getRoom(item.value),
  //   );
  // };

  return {
    load,

    get,

    getList,
  };
};
