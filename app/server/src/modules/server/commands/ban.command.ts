import {
  getUsersConfig,
  writeUserConfig,
} from "../../../shared/utils/users.utils.ts";
import { Server } from "../main.ts";
import { ProxyEvent } from "../../../shared/enums/event.enum.ts";

export const banCommand = {
  command: "ban",
  func: async ({ args }) => {
    const username = args[0];
    if (!username) return;

    const config = await getUsersConfig();
    if (config.blacklist.users.includes(username)) return;
    config.blacklist.users.push(username);

    await writeUserConfig(config);

    const user = Server.users.get({ username });
    if (!user) return;

    Server.proxy.$emit(ProxyEvent.$DISCONNECT_USER, {
      clientId: user.clientId,
    });
  },
};
