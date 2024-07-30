import { ProxyEventType, PrivateUser } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import { log } from "shared/utils/main.ts";

export const userLeftEvent: ProxyEventType<{ user: PrivateUser }> = {
  event: ProxyEvent.$USER_LEFT,
  func: ({ data: { user } }) => {
    if (!user) return;
    console.log(user);
    Server.game.users.remove(user);

    log(`${user.username} left!`);
  },
};
