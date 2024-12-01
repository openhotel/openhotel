import { ProxyEventType, PrivateUser } from "shared/types/main.ts";
import { Meta, ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { log } from "shared/utils/main.ts";

export const userJoinedEvent: ProxyEventType<{
  user: PrivateUser;
  meta: null | (number | string)[];
}> = {
  event: ProxyEvent.$USER_JOINED,
  func: async ({ data: { user: privateUser, meta } }) => {
    System.game.users.add(
      {
        accountId: privateUser.accountId,
        username: privateUser.username,
        meta,
      },
      privateUser,
    );
    log(`${privateUser.username} joined!`);

    const currentUser = System.game.users.get({
      accountId: privateUser.accountId,
    });

    //TODO process meta

    if (!(await currentUser.isOp())) return;

    if (meta?.[0] === Meta.TELEPORT) {
      const room = await System.game.rooms.get((meta[1] as string)!);
      if (!room) return;
      room.addUser(currentUser.getObject(), { x: meta[2], y: meta[3] });
    }
  },
};
