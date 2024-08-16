import { ProxyEventType, PrivateUser } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import { log } from "shared/utils/main.ts";

export const userJoinedEvent: ProxyEventType<{ user: PrivateUser }> = {
  event: ProxyEvent.$USER_JOINED,
  func: ({ data: { user } }) => {
    Server.game.users.add(
      {
        accountId: user.accountId,
        username: user.username,
      },
      user,
    );
    log(`${user.username} joined!`);
  },
};
