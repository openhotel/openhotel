import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";

export const clearCommand: Command = {
  command: "clear",
  usages: [""],
  description: "command.clear.description",
  func: async ({ user, args }) => {
    const roomId = user.getRoom();
    if (!roomId) return;

    const room = await System.game.rooms.get(roomId);

    for (const furniture of room.getFurnitures()) {
      await room.removeFurniture(furniture);
      room.emit(ProxyEvent.REMOVE_FURNITURE, {
        furniture,
      });
    }
  },
};
