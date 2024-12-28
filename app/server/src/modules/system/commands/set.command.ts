import { Command, RoomFurniture } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";
import { CrossDirection } from "@oh/utils";

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

    const $furniture = await System.game.furniture.get(furnitureId);
    if (!$furniture) return;

    if (!$furniture.direction[CrossDirection[direction].toLowerCase()]) return;

    if (
      $furniture.type === FurnitureType.FRAME &&
      (isNaN(wallX) || isNaN(wallY))
    )
      return;

    const roomId = user.getRoom();
    if (!roomId) return;

    const room = await System.game.rooms.get(roomId);

    const furniture: RoomFurniture = {
      furnitureId,
      type: $furniture.type,
      id: crypto.randomUUID(),
      direction,
      position: {
        x,
        z,
        y: 0,
      },
    };

    switch ($furniture.type) {
      case FurnitureType.TELEPORT:
        await System.game.teleports.setRoom(furniture.id, roomId);
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

    await room.addFurniture(furniture);
    room.emit(ProxyEvent.ADD_FURNITURE, {
      furniture,
    });
  },
};
