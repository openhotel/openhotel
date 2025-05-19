import { Command, CommandRoles } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const unsetCommand: Command = {
  command: "unset",
  role: CommandRoles.OP,
  usages: ["<furniture_id>"],
  description: "command.unset.description",
  func: async ({ user, args }) => {
    if (1 !== args.length) return;

    const [id] = args as [string];

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

    await room.removeFurniture(furniture);
  },
};
