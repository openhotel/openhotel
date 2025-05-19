import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";

export const clearCommand: Command = {
  command: "clear",
  usages: [""],
  role: CommandRoles.OP,
  description: "command.clear.description",
  func: async ({ user }) => {
    const roomId = user.getRoom();
    if (!roomId) return;

    const room = await System.game.rooms.get(roomId);
    if (room.type !== "private") return;

    for (const furniture of room.getFurniture()) {
      await room.removeFurniture(furniture);
    }
  },
};
