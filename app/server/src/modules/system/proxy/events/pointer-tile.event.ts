import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import {System} from "../../main.ts";

export const pointerTileEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_TILE,
  func: async ({ data: { position }, user }) => {
    await user.setTargetPosition(position);

    // Get the user's current room
    const roomId = user.getRoom();
    const roomUsers = (await System.game.rooms.get(roomId))?.getUsers?.() || [];

    for (const accountId of roomUsers) {
      if (accountId === user.getAccountId()) continue;
      const targetUser = System.game.users.get({ accountId });
      if (!targetUser) continue;

      // Generate a random position within 1–9 range (x and z)
      const x = Math.floor(Math.random() * 9) + 1;
      const z = Math.floor(Math.random() * 9) + 1;

      const room = System.game.rooms.get(roomId);
      if (!room) continue;

      const y = 0;
      const position = { x, y, z };

      await targetUser.setTargetPosition(position);
    }

  },
};
