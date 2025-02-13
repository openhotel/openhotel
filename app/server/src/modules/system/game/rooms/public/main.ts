import { getRoom } from "./room.ts";
import { PublicRoomMutable } from "shared/types/rooms/public.types.ts";

export const $public = () => {
  let roomUserMap: Record<string, string[]> = {};

  const $getRoom = getRoom(roomUserMap);

  const load = () => {};

  const get = async (roomId: string): Promise<PublicRoomMutable | null> => {
    return null;
  };
  const getList = async (): Promise<PublicRoomMutable[]> => {
    return [];
  };

  // const getList = async (): Promise<PrivateRoomMutable[]> => {
  //   return (await System.db.list({ prefix: ["rooms", "private"] })).map(
  //     (item) => $getRoom(item.value),
  //   );
  // };

  return {
    load,
  };
};
