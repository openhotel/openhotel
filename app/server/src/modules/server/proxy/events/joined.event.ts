import { ProxyEventType, User } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import { log } from "shared/utils/main.ts";

export const joinedEvent: ProxyEventType<{ user: User }> = {
  event: ProxyEvent.$JOINED,
  func: ({ user }) => {
    Server.users.add(user);
    log(`${user.username} joined!`);
  },
};
