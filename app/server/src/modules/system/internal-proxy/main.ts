import { getServerSocket, ServerClient } from "@da/socket";
import { getRandomString, getFreePort } from "@oh/utils";
import { System } from "modules/system/main.ts";

export const internalProxy = () => {
  let $server;
  let $port;

  const $token = getRandomString(16);

  let $clientMap: Record<string, ServerClient> = {};

  const load = async () => {
    $port = System.config.isDevelopment() ? 24490 : await getFreePort();

    $server = getServerSocket(
      $port,
      () => new Response("404", { status: 404 }),
    );

    $server.on(
      "guest",
      async ({ clientId, protocols: [type, token, ...protocols], headers }) => {
        console.log("INTERNAL ->", "guest", clientId, protocols);
        if (!System.config.isDevelopment() && $token !== token) return false;

        switch (type) {
          case "game":
            //TODO <<<<<<
            return true;
        }
        return false;
      },
    );
    $server.on("connected", async (client: ServerClient) => {
      $clientMap[client.id] = client;
      console.log("INTERNAL ->", "connected", client.id);
    });
    $server.on("disconnected", (client: ServerClient) => {
      console.log("INTERNAL ->", "disconnected", client.id);
    });
  };

  const getPort = () => $port;
  const getToken = () => $token;

  return { load, getPort, getToken };
};
