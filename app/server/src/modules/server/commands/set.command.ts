import { Command, RoomFurniture } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { Server } from "modules/server/main.ts";
import { getRandomString } from "shared/utils/random.utils.ts";
import { CrossDirection } from "shared/enums/direction.enums.ts";

export const setCommand: Command = {
  command: "set",
  func: async ({ user, args }) => {
    if (args.length !== 3) return;

    const [furnitureId, x, z] = args as [string, number, number];
    if (!furnitureId || isNaN(x) || isNaN(z)) return;

    const $furniture = Server.game.furniture.get(furnitureId);
    if (!$furniture) return;

    const roomId = user.getRoom();
    if (!roomId) return;

    const room = Server.game.rooms.get(roomId);

    const furniture: RoomFurniture = {
      id: furnitureId,
      uid: getRandomString(32),
      size: $furniture.size,
      direction: CrossDirection.NORTH,
      position: {
        x,
        z,
        y: 0,
      },
    };

    room.addFurniture(furniture);
    room.emit(ProxyEvent.ADD_FURNITURE, {
      furniture,
    });
  },
};
