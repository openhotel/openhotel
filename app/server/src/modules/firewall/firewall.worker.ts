import {
  appendCORSHeaders,
  getRandomString,
  initLog,
  log,
} from "shared/utils/main.ts";
import { getChildWorker } from "worker_ionic";
import { WorkerProps } from "shared/types/main.ts";
import { routesList } from "./router/main.ts";
import { getServerSocket, ServerClient } from "socket_ionic";

initLog();
const proxyWorker = getChildWorker();

let userList = [];

proxyWorker.on("userList", (data) => {
  userList = data.userList;
});
proxyWorker.on(
  "start",
  async ({ config, envs, token: proxyProtocolToken }: WorkerProps) => {
    let handshakeList: {
      session: string;
      clientId: string;
    }[] = [];

    const protocolToken = getRandomString(64);

    const server = getServerSocket(
      config.firewall.port,
      async (request: Request) => {
        const { method, url } = request;
        const { pathname } = new URL(url);

        const foundRoute = routesList.find(
          (route) => route.method === method && route.pathname === pathname,
        );

        let response = new Response("404", { status: 404 });
        if (foundRoute) {
          response = await foundRoute.fn(request, config, envs, {
            userList,
            handshakeList,
            protocolToken,
          });
          appendCORSHeaders(response.headers);
          const { session } = await response.json();
          if (session) {
            handshakeList.push({
              session,
              clientId: null,
            });
            setTimeout(() => {
              handshakeList = handshakeList.filter(
                (handshake) => handshake.session !== session,
              );
            }, 15_000);
          }
        }

        return response;
      },
    );

    server.on("guest", (clientId: string, [token, session]) => {
      if (
        token !== protocolToken &&
        handshakeList.length >= config.limits.handshakes
      )
        return false;
      const foundHandshake = handshakeList.find(
        (handshake) => !handshake.clientId && handshake.session === session,
      );
      if (!foundHandshake) return false;
      foundHandshake.clientId = clientId;
      return true;
    });
    server.on("connected", (client: ServerClient) => {
      const foundHandshake = handshakeList.find(
        (handshake) => handshake.clientId === client.id,
      );
      if (!foundHandshake) return client.close();

      //TODO auth.openhotel.club
      // Check if already joined
      client.on("session", ({ username }) => {
        const data = {
          session: getRandomString(32),
          token: proxyProtocolToken,

          userId: getRandomString(128),
          username,
        };

        client.emit("join", data);
        proxyWorker.emit("join", data);
      });

      setTimeout(() => {
        client.close();
      }, 1_000);
    });
    server.on("disconnected", (client: ServerClient) => {
      handshakeList = handshakeList.filter(
        (handshake) => handshake.clientId !== client.id,
      );
    });

    log(`Firewall started on :${config.firewall.port}`);
  },
);
