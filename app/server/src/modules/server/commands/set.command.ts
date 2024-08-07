import { Command, RoomFurniture } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { Server } from "modules/server/main.ts";
import { getRandomString } from "shared/utils/random.utils.ts";
import { CrossDirection } from "shared/enums/direction.enums.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";

export const setCommand: Command = {
  command: "set",
  func: async ({ user, args }) => {
    if (3 > args.length) return;

    const [furnitureId, x, z, direction, wallX, wallY] = args as [
      string,
      number,
      number,
      CrossDirection,
      number,
      number,
    ];
    if (!furnitureId || isNaN(x) || isNaN(z) || isNaN(direction)) return;

    if (CrossDirection.NORTH > direction || direction > CrossDirection.WEST)
      return;

    const $furniture = Server.game.furniture.get(furnitureId);
    console.log($furniture);
    if (!$furniture) return;

    if (
      $furniture.type === FurnitureType.FRAME &&
      (isNaN(wallX) || isNaN(wallY))
    )
      return;

    const roomId = user.getRoom();
    if (!roomId) return;

    const room = Server.game.rooms.get(roomId);

    const furniture: RoomFurniture = {
      id: furnitureId,
      type: $furniture.type,
      uid: getRandomString(32),
      direction,
      position: {
        x,
        z,
        y: 0,
      },
    };

    switch ($furniture.type) {
      case FurnitureType.FURNITURE:
        furniture.size = $furniture.size;
        break;
      case FurnitureType.FRAME:
        furniture.framePosition = {
          x: wallX,
          y: wallY,
        };
        break;
    }

    room.addFurniture(furniture);
    room.emit(ProxyEvent.ADD_FURNITURE, {
      furniture,
    });
  },
};
