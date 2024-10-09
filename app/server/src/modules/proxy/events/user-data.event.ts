import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const userDataEvent: ProxyEventType<{
  users: string[];
  event: string;
  message: unknown;
}> = {
  event: ProxyEvent.$USER_DATA,
  func: ({ data: { users, event, message } }) => {
    try {
      // broadcast
      if (users.includes("*")) return Proxy.getServer().emit(event, message);
      //
      for (const user of users.map(Proxy.getUser))
        Proxy.getClient(user?.clientId)?.emit?.(event, message);
    } catch (e) {
      console.error("Error $USER_DATA");
      console.error(e);
    }
  },
};
