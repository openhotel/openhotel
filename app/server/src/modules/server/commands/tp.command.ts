import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { Server } from "modules/server/main.ts";

export const tpCommand: Command = {
  command: "tp",
  func: async ({ user, args }) => {
    if (args.length !== 2) return;

    const [x, z] = args as number[];

    if (isNaN(x) || isNaN(z)) return;

    const roomId = user.getRoom();
    if (!roomId) return;
    const room = Server.game.rooms.get(roomId);

    user.setPathfinding(null);
    user.setPosition({ x, z });

    room.emit(ProxyEvent.SET_POSITION_HUMAN, {
      userId: user.getId(),
      position: { x, z, y: 0 },
    });
  },
};
