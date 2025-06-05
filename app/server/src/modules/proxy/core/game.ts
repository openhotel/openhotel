import { ServerClient } from "@da/socket";
import { Proxy } from "modules/proxy/main.ts";

export const game = () => {
  let userMapClient: Record<string, ServerClient> = {};

  const guest = async (
    clientId: string,
    [gameId, accountId, token]: string[],
    ip: string,
  ) => {
    const config = Proxy.getConfig();

    if (config.version !== "development" && state !== Proxy.getState())
      return false;

    console.log(clientId, gameId, accountId, token, "<<<<");
    return true;
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

  return {
    guest,
    connected,
    disconnected,
  };
};
