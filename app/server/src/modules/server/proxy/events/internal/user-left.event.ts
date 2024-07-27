import { ProxyEventType, User } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import { log } from "shared/utils/main.ts";

export const userLeftEvent: ProxyEventType<{ user: User }> = {
  event: ProxyEvent.$USER_LEFT,
  func: ({ user }) => {
    Server.rooms.removeUser(user);
    Server.users.remove(user);

    log(`${user.username} left!`);
  },
};
