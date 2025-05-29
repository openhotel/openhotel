import { Command, CommandRoles, RoomFurniture } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";
import { CrossDirection } from "@oh/utils";
import { RoomPointEnum } from "shared/enums/room.enums.ts";
import {
  isDoorRenderable,
  isWallRenderable,
} from "shared/utils/rooms.utils.ts";
import { ulid } from "@std/ulid";
import { getTextFromArgs } from "shared/utils/args.utils.ts";

export const setCommand: Command = {
  command: "set",
  role: CommandRoles.OP,
  usages: ["<furniture_id> <x> <z> <direction> [wallX] [wallY]"],
  description: "command.set.description",
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
    if (room.type !== "private") return;

    const furniture: RoomFurniture = {
      furnitureId,
      type: $furniture.type,
      id: ulid(),
      direction,
      position: {
        x,
        z,
        y: 0,
      },
    };

    const roomPoint = room.getPoint(furniture.position);
    if (
      roomPoint === RoomPointEnum.EMPTY ||
      roomPoint === RoomPointEnum.SPAWN
    ) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: getTextFromArgs(
          "The furniture cannot be placed at position {{x}},{{z}}",
          { x, z },
        ),
      });
      return;
    }

    if (furniture.type === FurnitureType.FRAME) {
      const layout = room.getLayout();
      const isWallOrDoorX =
        isWallRenderable(layout, furniture.position, true) ||
        isDoorRenderable(layout, furniture.position, true);
      const isWallOrDoorZ =
        isWallRenderable(layout, furniture.position, false) ||
        isDoorRenderable(layout, furniture.position, false);

      if (!isWallOrDoorX && !isWallOrDoorZ) {
        return user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: "Frames need to be attached to the wall",
        });
      }

      if (
        (!isWallOrDoorZ &&
          isWallOrDoorX &&
          direction === CrossDirection.NORTH) ||
        (!isWallOrDoorX && isWallOrDoorZ && direction === CrossDirection.EAST)
      ) {
        return user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: "Incorrect frame direction",
        });
      }
    }

    furniture.size = $furniture.size;

    if ($furniture.type === FurnitureType.FRAME) {
      furniture.framePosition = {
        x: wallX,
        y: wallY,
      };
    }

    await room.addFurniture(furniture);
  },
};
