import { ServerClient } from "@da/socket";
import { Proxy } from "modules/proxy/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

type UserRequestType = {
  accountId: string;
  gameId: string;
  token: string;
  ip: string;
};

export const game = () => {
  let userRequestMap: Record<string, UserRequestType> = {};
  let clientUserRequestMap: Record<string, UserRequestType> = {};

  let userMapClient: Record<string, ServerClient> = {};

  const guest = async (
    clientId: string,
    [gameId, accountId, token]: string[],
    ip: string,
  ) => {
    const accountToken = userRequestMap[accountId];
    if (!accountToken) return false;

    const valid =
      accountToken.gameId === gameId &&
      accountToken.token === token &&
      accountToken.ip === ip;

    if (!valid) return false;

    clientUserRequestMap[clientId] = { ...userRequestMap[accountId] };
    delete userRequestMap[accountId];

    return true;
  };

  const connected = (client: ServerClient) => {
    try {
      userMapClient[client.id] = client;
      const { accountId, gameId } = clientUserRequestMap[client.id];

      Proxy.getServerWorker().emit(ProxyEvent.$GAME_USER_JOIN, {
        data: {
          user: Proxy.core.user.getUser(accountId),
          clientId: client.id,
          gameId,
        },
      });

      client.on("$$user-ready", () => {
        Proxy.getServerWorker().emit(ProxyEvent.$GAME_USER_READY, {
          data: {
            user: Proxy.core.user.getUser(accountId),
            clientId: client.id,
            gameId,
          },
        });
      });
      client.on("$$user-data", ({ event, message }) => {
        Proxy.getServerWorker().emit(ProxyEvent.$GAME_USER_DATA, {
          data: {
            user: Proxy.core.user.getUser(accountId),
            clientId: client.id,
            gameId,
            event,
            message,
          },
        });
      });
      client.on("$$user-exit", () => {
        userMapClient[client.id].close();
      });
    } catch (e) {
      console.error("proxy-game-1");
      console.error(e);
    }
  };

  const disconnected = (client: ServerClient) => {
    try {
      const { gameId, accountId } = clientUserRequestMap[client.id];

      userMapClient[client.id].close();

      Proxy.getServerWorker().emit(ProxyEvent.$GAME_USER_LEFT, {
        data: {
          user: Proxy.core.user.getUser(accountId),
          clientId: client.id,
          gameId,
        },
      });
      delete userMapClient[client.id];
      delete clientUserRequestMap[client.id];
    } catch (e) {
      console.error("proxy-game-2");
      console.error(e);
    }
  };

  const setUserRequest = (userRequest: UserRequestType) => {
    userRequestMap[userRequest.accountId] = userRequest;
  };

  const emitUser = (
    gameId: string,
    clientId: string,
    event: string,
    message: any,
  ) => {
    const clientData = clientUserRequestMap[clientId];
    if (!clientData || clientData.gameId !== gameId) return;

    userMapClient[clientId].emit(event, message);
  };
  const disconnectUser = (gameId: string, clientId: string) => {
    const clientData = clientUserRequestMap[clientId];
    if (!clientData || clientData.gameId !== gameId) return;

    userMapClient[clientId].close();
  };

  return {
    guest,
    connected,
    disconnected,

    setUserRequest,
    emitUser,
    disconnectUser,
  };
};
