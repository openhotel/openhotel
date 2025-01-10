import { Command, RoomFurniture } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";
import { CrossDirection } from "@oh/utils";
import { RoomPointEnum } from "shared/enums/room.enums.ts";
import { isWallRenderable } from "shared/utils/rooms.utils.ts";
import { WALL_HEIGHT } from "shared/consts/wall.consts.ts";
import { TILE_Y_HEIGHT } from "shared/consts/tiles.consts.ts";

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

    const roomPoint = room.getPoint(furniture.position);
    if (roomPoint === RoomPointEnum.EMPTY || roomPoint === RoomPointEnum.SPAWN)
      return;
    if (furniture.type === FurnitureType.FRAME) {
      const layout = room.getObject().layout;
      const isWallX = isWallRenderable(layout, furniture.position, true);
      const isWallZ = isWallRenderable(layout, furniture.position, false);

      if (!isWallX && !isWallZ) return;

      // TODO: sacar altura
      console.log(roomPoint);
      const previewY = -((parseInt(roomPoint + "") ?? 1) - 1);
      const y = Math.floor(previewY);

      const wallHeight = WALL_HEIGHT - y * TILE_Y_HEIGHT;
      console.log({ wallHeight });
      if (wallY > wallHeight) return;
      // altura wallX wallY
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
