import { ServerClient } from "@da/socket";
import { Proxy } from "modules/proxy/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { waitUntil } from "@oh/utils";

export const game = () => {
  let userMapClient: Record<string, ServerClient> = {};

  let guestMapValidity: Record<string, Record<string, boolean>> = {};

  const guest = async (
    clientId: string,
    [gameId, accountId, token]: string[],
    ip: string,
  ) => {
    const config = Proxy.getConfig();

    if (config.version !== "development") return false;

    if (!guestMapValidity[gameId]) guestMapValidity[gameId] = {};
    guestMapValidity[gameId][accountId] = null;

    Proxy.getServerWorker().emit(ProxyEvent.$GAME_GUEST_CHECK, {
      data: {
        gameId,
        accountId,
        token,
      },
    });

    try {
      await waitUntil(() => guestMapValidity[gameId][accountId] !== null);

      console.log(
        clientId,
        gameId,
        accountId,
        token,
        "<<<<",
        guestMapValidity[gameId][accountId],
      );
      return guestMapValidity[gameId][accountId];
    } catch (e) {
      return false;
    }
  };

  const connected = (client: ServerClient) => {
    try {
    } catch (e) {
      console.error("proxy-7");
      console.error(e);
    }
  };

  const disconnected = (client: ServerClient) => {
    try {
    } catch (e) {
      console.error("proxy-8");
      console.error(e);
    }
  };

  const setGameCheckValidity = (
    gameId: string,
    accountId: string,
    valid: boolean,
  ) => (guestMapValidity[gameId][accountId] = valid);

  return {
    guest,
    connected,
    disconnected,

    setGameCheckValidity,
  };
};
