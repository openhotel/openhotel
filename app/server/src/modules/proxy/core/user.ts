import * as bcrypt from "@da/bcrypt";
import { getRandomString, decodeBase64 } from "@oh/utils";
import { Proxy } from "modules/proxy/main.ts";
import { PrivateUser } from "shared/types/user.types.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { PROXY_CLIENT_EVENT_WHITELIST } from "shared/consts/event.consts.ts";
import { ServerClient } from "@da/socket";

export const user = () => {
  // This maps client id to user id (1:1), to prevent the connection of the user multiple times
  // The accountId cannot be duplicated as value, if so, it would be the same user connected twice
  let clientIdAccountIdMap: Record<string, string> = {};
  let userList: PrivateUser[] = [];
  let userTokenMap: Record<string, string> = {};

  const guest = async (
    clientId: string,
    state: string,
    connectionToken: string,
    ip: string,
  ) => {
    const apiToken = getRandomString(32);
    const apiTokenHash = bcrypt.hashSync(apiToken, bcrypt.genSaltSync(8));

    const hemisphere = await Proxy.coordinates.get(ip);

    const config = Proxy.getConfig();

    userTokenMap[clientId] = apiToken;
    if (!config.auth.enabled) {
      const username = connectionToken;
      const accountId = state;

      const foundUser = userList.find((user) => user.accountId === accountId);
      if (foundUser) {
        Proxy.getClient(foundUser.clientId)?.close();
        userList = userList.filter((user) => user.accountId !== accountId);
      }

      userList.push({
        clientId,
        accountId,
        username,
        apiToken: apiTokenHash,
        auth: {
          connectionToken: "AUTH_TOKEN",
        },
        ip,
        languages: ["en", "es"],
        hemisphere,
        admin: true,
      });
      return true;
    }

    if (state !== Proxy.getState() && userList.length >= config.limits.players)
      return false;

    const scopesResponse = await Proxy.auth.fetch({
      url: "/user/@me/scopes",
      connectionToken,
    });
    if (!scopesResponse) return false;

    if (
      !Proxy.getScopes().every((scope) => scopesResponse.scopes.includes(scope))
    )
      return false;

    const { accountId, username, admin, languages } = await Proxy.auth.fetch({
      url: "/user/@me",
      connectionToken,
    });

    const foundUser = userList.find((user) => user.accountId === accountId);
    if (foundUser) {
      Proxy.getClient(foundUser.clientId)?.close();
      userList = userList.filter((user) => user.accountId !== accountId);
    }

    userList.push({
      clientId,
      accountId,
      username,
      apiToken: apiTokenHash,
      auth: {
        connectionToken,
      },
      ip,
      hemisphere,
      admin,
      languages,
    });
    return true;
  };

  const connected = (client: ServerClient) => {
    try {
      const foundUser: PrivateUser | undefined = userList.find(
        (user) => user.clientId === client.id,
      );

      if (!foundUser) return client?.close();

      let hasLoad = false;
      client.on(ProxyEvent.$LOAD, ({ meta }) => {
        if (hasLoad) return;
        hasLoad = true;

        client.emit(ProxyEvent.WELCOME, {
          datetime: Date.now(),
          account: {
            ...foundUser,
            apiToken: userTokenMap[foundUser.clientId],
          },
        });
        delete userTokenMap[foundUser.clientId];

        Proxy.getServerWorker().emit(ProxyEvent.$USER_JOINED, {
          data: { user: foundUser, meta: meta ? decodeBase64(meta) : null },
        });
      });
      // Assign the accountId to the clientId. accountId can only be once as value.
      clientIdAccountIdMap[client?.id] = foundUser.accountId;

      client.on(ProxyEvent.$USER_DATA, ({ event, message }) => {
        if (!foundUser) return client.close();
        try {
          // Disconnect client if tries to send events outside the whitelist
          if (!PROXY_CLIENT_EVENT_WHITELIST.includes(event))
            return client?.close?.();
          Proxy.getServerWorker().emit(ProxyEvent.$USER_DATA, {
            user: foundUser,
            event,
            message,
          });
        } catch (e) {
          console.error("proxy-6");
          console.error(e);
        }
      });
    } catch (e) {
      console.error("proxy-7");
      console.error(e);
    }
  };

  const disconnected = (client: ServerClient) => {
    try {
      if (!client?.id) return;

      const accountId = clientIdAccountIdMap[client.id];
      if (!accountId) return;

      delete clientIdAccountIdMap[client.id];

      const foundUser = userList.find((user) => user.accountId === accountId);
      if (!foundUser) return;

      userList = userList.filter((user) => user.clientId !== client.id);

      Proxy.getServerWorker().emit(ProxyEvent.$USER_LEFT, {
        data: { user: foundUser },
      });
    } catch (e) {
      console.error("proxy-8");
      console.error(e);
    }
  };

  const getUserList = (): PrivateUser[] => userList;

  return {
    guest,
    connected,
    disconnected,

    getUserList,
  };
};
