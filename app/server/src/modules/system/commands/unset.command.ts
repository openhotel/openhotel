import { Command } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { FurnitureType, ProxyEvent } from "shared/enums/main.ts";
import { __ } from "shared/utils/main.ts";

export const unsetCommand: Command = {
  command: "unset",
  func: async ({ user, args }) => {
    if (1 !== args.length) return;

    const [id] = args as [string];

    const roomId = user.getRoom();
    if (!roomId) return;

    const room = await System.game.rooms.get(roomId);
    const furniture = room
      .getFurnitures()
      .find((furniture) => furniture.id === id);

    if (!furniture) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: __(user.getLanguage())("Furniture not found!"),
      });
      return;
    }

    if (furniture.type === FurnitureType.TELEPORT)
      System.game.teleports.removeRoom(furniture.id);

    await room.removeFurniture(furniture);
    room.emit(ProxyEvent.REMOVE_FURNITURE, {
      furniture,
    });
  },
};
