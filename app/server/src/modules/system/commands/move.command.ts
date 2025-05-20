import { Command, CommandRoles } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { FurnitureType, ProxyEvent } from "shared/enums/main.ts";
import { CrossDirection } from "@oh/utils";

export const moveCommand: Command = {
  command: "move",
  role: CommandRoles.OP,
  usages: ["<furniture_id> <x> <z> <direction> [wallX] [wallY]"],
  description: "command.move.description",
  func: async ({ user, args }) => {
    const [id, x, z, direction, wallX, wallY] = args as [
      string,
      number,
      number,
      CrossDirection,
      number,
      number,
    ];
    if (!id || isNaN(x) || isNaN(z) || isNaN(direction)) return;

    if (CrossDirection.NORTH > direction || direction > CrossDirection.WEST)
      return;

    const roomId = user.getRoom();
    if (!roomId) return;

    const room = await System.game.rooms.get(roomId);
    if (room.type !== "private") return;

    const furniture = room
      .getFurniture()
      .find((furniture) => furniture.id === id);

    if (!furniture) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: "Furniture not found!",
      });
      return;
    }

    const $furniture = await System.game.furniture.get(furniture.furnitureId);
    if (!$furniture) return;

    if (!$furniture.direction[CrossDirection[direction].toLowerCase()]) return;

    furniture.position = {
      x,
      z,
      y: 0,
    };
    furniture.direction = direction;

    switch ($furniture.type) {
      case FurnitureType.FRAME:
        furniture.framePosition = {
          x: wallX,
          y: wallY,
        };
        break;
    }

    await room.updateFurniture(furniture);
  },
};
