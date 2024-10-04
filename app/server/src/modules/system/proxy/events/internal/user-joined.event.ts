import { ProxyEventType, PrivateUser } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { log } from "shared/utils/main.ts";

export const userJoinedEvent: ProxyEventType<{ user: PrivateUser }> = {
  event: ProxyEvent.$USER_JOINED,
  func: ({ data: { user } }) => {
    System.game.users.add(
      {
        accountId: user.accountId,
        username: user.username,
      },
      user,
    );
    log(`${user.username} joined!`);
  },
};
