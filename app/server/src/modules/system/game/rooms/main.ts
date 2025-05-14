import { $public } from "./public/main.ts";
import { $private } from "./private/main.ts";
import { Room, RoomMutable } from "shared/types/rooms/main.ts";
import { pathfinding } from "./pathfinding.ts";
import { layout } from "./layout.ts";

export const rooms = () => {
  const $$private = $private();
  const $$public = $public();

  const $layout = layout();

  const $pathfinding = pathfinding();

  const load = async () => {
    $pathfinding.load();
    await $$public.load();
    $$private.load();
  };

  const get = async <Room extends RoomMutable>(
    roomId: string,
  ): Promise<Room | null> => {
    if (!roomId) return null;

    const privateRoomFound = await $$private.get(roomId);
    if (privateRoomFound) return privateRoomFound as Room;

    const publicRoomFound = await $$public.get(roomId);
    if (publicRoomFound) return publicRoomFound as Room;

    return null;
  };

  const getList = async <Room extends RoomMutable>(
    type: "public" | "private",
  ): Promise<Room[]> => {
    switch (type) {
      case "private":
        return (await $$private.getList()) as Room[];
      case "public":
        return (await $$public.getList()) as Room[];
    }
  };

  const add = (room: Room) => {
    switch (room.type) {
      case "private": {
        return $$private.add(room);
      }
    }
  };

  return {
    load,

    get,
    getList,

    add,

    layout: $layout,

    pathfinding: $pathfinding,
  };
};
