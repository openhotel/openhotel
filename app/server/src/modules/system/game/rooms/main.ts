import { $public } from "./public/main.ts";
import { $private } from "./private/main.ts";
import { RoomMutable } from "shared/types/rooms/main.ts";

export const rooms = () => {
  const $$private = $private();
  const $$public = $public();

  const load = () => {
    $$private.load();
  };

  const get = async (roomId: string): Promise<RoomMutable | null> => {
    const privateRoomFound = await $$private.get(roomId);
    if (privateRoomFound) return privateRoomFound;

    return null;
  };

  return {
    load,

    get,

    /**
     * @deprecated Prevent use outside here
     */
    private: $$private,
    /**
     * @deprecated Prevent use outside here
     */
    public: $$public,
  };
};
