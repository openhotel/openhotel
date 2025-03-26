import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";

export const tpCommand: Command = {
  command: "tp",
  role: CommandRoles.OP,
  usages: ["<x> <z>"],
  description: "command.tp.description",
  func: async ({ user, args }) => {
    if (args.length !== 2) return;

    const [x, z] = args as number[];

    if (isNaN(x) || isNaN(z)) return;

    const roomId = user.getRoom();
    if (!roomId) return;
    const room = await System.game.rooms.get(roomId);
    const y = room.getYFromPoint({ x, z }) ?? 0;

    user.setPosition({ x, z });

    room?.emit(ProxyEvent.SET_POSITION_HUMAN, {
      accountId: user.getAccountId(),
      position: { x, z, y },
    });
  },
};
