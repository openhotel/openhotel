import { ProxyEventType, PrivateUser } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const userLeftEvent: ProxyEventType<{ user: PrivateUser }> = {
  event: ProxyEvent.$USER_LEFT,
  func: async ({ data: { user } }) => {
    if (!user) return;
    await System.game.users.remove(user);
  },
};
