import { Command, CommandRoles, RoomFurniture } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";
import { CrossDirection } from "@oh/utils";
import { RoomPointEnum } from "shared/enums/room.enums.ts";
import { isWallRenderable } from "shared/utils/rooms.utils.ts";
import { TOP_WALL_HEIGHT, WALL_HEIGHT } from "shared/consts/wall.consts.ts";
import { TILE_Y_HEIGHT, TILE_WIDTH } from "shared/consts/tiles.consts.ts";
import { __ } from "shared/utils/languages.utils.ts";

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

    const roomPoint = room.getPoint(furniture.position);
    if (
      roomPoint === RoomPointEnum.EMPTY ||
      roomPoint === RoomPointEnum.SPAWN
    ) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: __(user.getLanguage())(
          "The furniture cannot be placed at position {{x}},{{z}}",
          { x, z },
        ),
      });
      return;
    }

    if (furniture.type === FurnitureType.FRAME) {
      const layout = room.getObject().layout;
      const isWallX = isWallRenderable(layout, furniture.position, true);
      const isWallZ = isWallRenderable(layout, furniture.position, false);

      if (!isWallX && !isWallZ) {
        user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: __(user.getLanguage())(
            "Frames need to be attached to the wall",
          ),
        });
        return;
      }

      const maxX = Math.floor(TILE_WIDTH / 2);
      if (Math.abs(wallX) > maxX) {
        user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: __(user.getLanguage())(
            "Frames cannot be placed beyond the allowed X position ({{x}})",
            {
              x: maxX,
            },
          ),
        });
        return;
      }

      // TODO: Default to 34 until furniture metadata is fully updated -> https://github.com/openhotel/asset-editor/issues/14
      const frameHeight = $furniture?.bounds?.height || 34;

      const previewY = -((parseInt(roomPoint + "") ?? 1) - 1);
      const y = Math.floor(previewY);
      const wallHeight = WALL_HEIGHT - y * TILE_Y_HEIGHT;
      const limitHeight = Math.floor(
        wallHeight - frameHeight / 2 - TOP_WALL_HEIGHT / 2,
      );

      if (wallY > limitHeight) {
        user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: __(user.getLanguage())(
            "Frames cannot exceed the height of the wall ({{height}})",
            {
              height: limitHeight,
            },
          ),
        });
        return;
      }
    }

    switch ($furniture.type) {
      case FurnitureType.TELEPORT:
        await System.game.teleports.setRoom(furniture.id, roomId);
      // Not add break, it's not a bug, it's a feature!!
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
