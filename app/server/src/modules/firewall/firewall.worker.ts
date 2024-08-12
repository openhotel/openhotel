import {
  appendCORSHeaders,
  getRandomString,
  getUsersConfig,
  initLog,
  log,
} from "shared/utils/main.ts";
import { getChildWorker } from "worker_ionic";
import { UsersConfig, WorkerProps } from "shared/types/main.ts";
import { routesList } from "./router/main.ts";
import { getServerSocket, ServerClient } from "socket_ionic";

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
    initLog(envs);

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

      client.on("session", async ({ sessionId, token, username, language }) => {
        if (((!sessionId || !token) && !envs.isDevelopment) || !username)
          return client.close();

        const usersConfig: UsersConfig = await getUsersConfig();
        if (
          //check if op, ignore the rest
          !usersConfig.op.users.includes(username) &&
          //check blacklist
          ((usersConfig.blacklist.active &&
            usersConfig.blacklist.users.includes(username)) ||
            //check whitelist
            (usersConfig.whitelist.active &&
              !usersConfig.whitelist.users.includes(username)))
        )
          return client.close();

        const accountData = {
          session: getRandomString(32),
          token: proxyProtocolToken,

          userId: getRandomString(16),
          username,

          language: language.split("-")[0] ?? "en",
        };

        if (!envs.isDevelopment) {
          const headers = new Headers();
          headers.append("Content-Type", "application/json");

          const response = await fetch(
            `${config.auth.url}/v1/hotel/verify-session`,
            {
              headers,
              method: "POST",
              body: JSON.stringify({
                sessionId,
                token,
                username,
              }),
            },
          );
          const { status, data } = await response.json();

          // Account.id === User.id
          // "account" when is at auth, "user" when is at server
          accountData.userId = data.accountId;

          if (status !== 200 || !data.accountId || !data.username)
            return client.close();
        }

        client.emit("join", accountData);
        proxyWorker.emit("join", accountData);
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
