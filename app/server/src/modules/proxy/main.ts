import { log } from "shared/utils/main.ts";
import { getChildWorker } from "worker_ionic";
import {
  ConfigTypes,
  Envs,
  PrivateUser,
  WorkerProps,
} from "shared/types/main.ts";
import { getServerSocket, ServerClient } from "@da/socket";
import { PROXY_CLIENT_EVENT_WHITELIST } from "shared/consts/main.ts";
import { ProxyEvent, Scope } from "shared/enums/main.ts";
import { routesList } from "./router/main.ts";
import { requestClient } from "./router/client.request.ts";
import * as bcrypt from "@da/bcrypt";
import {
  waitUntil,
  getRandomString,
  getURL,
  appendCORSHeaders,
  getIpFromRequest,
} from "@oh/utils";
import { eventList } from "./events/main.ts";
import { auth } from "../shared/auth.ts";
import { coordinates } from "../shared/coordinates.ts";

export const Proxy = (() => {
  const serverWorker = getChildWorker();

  // This maps client id to user id (1:1), to prevent the connection of the user multiple times
  // The accountId cannot be duplicated as value, if so, it would be the same user connected twice
  let clientIdAccountIdMap: Record<string, string> = {};
  let userList: PrivateUser[] = [];
  let userTokenMap: Record<string, string> = {};
  let userClientMap: Record<string, ServerClient> = {};

  const state = getRandomString(64);

  const $auth = auth();
  const $coordinates = coordinates();
  let server;
  let $config: ConfigTypes;
  let $envs: Envs;

  const load = async ({ envs, config }: WorkerProps) => {
    $config = config;
    $envs = envs;

    await $auth.load(config);

    for (const { event, func } of eventList)
      serverWorker.on(event, (data: unknown) => func({ data }));

    const isDevelopment = config.version === "development";

    server = getServerSocket(
      config.port * (isDevelopment ? 10 : 1),
      async ($request: Request, connInfo) => {
        const headers = new Headers($request.headers);
        headers.set("remote-address", connInfo.remoteAddr.hostname);
        const request = new Request($request, { headers });
        let { method, url } = request;

        if (isDevelopment) url = url.replace("/proxy", "");
        const { pathname } = getURL(url);

        const clientResponse = await requestClient(request, config);
        if (clientResponse) return clientResponse;

        const foundRoute = routesList.find(
          (route) =>
            route.method === method && pathname.startsWith(route.pathname),
        );

        let response = new Response("404", { status: 404 });
        if (foundRoute) response = await foundRoute.fn(request);
        appendCORSHeaders(response.headers);
        return response;
      },
    );

    server.on(
      "guest",
      async ({
        clientId,
        connInfo,
        protocols: [state, connectionToken],
        headers: givenHeaders,
      }) => {
        const headers = new Headers({
          ...givenHeaders,
          "remote-address": connInfo.remoteAddr.hostname,
        });

        const apiToken = getRandomString(32);
        const apiTokenHash = bcrypt.hashSync(apiToken, bcrypt.genSaltSync(8));

        const ip = getIpFromRequest({ headers } as Request);

        const hemisphere = await $coordinates.get(ip);

        userTokenMap[clientId] = apiToken;
        if (!config.auth.enabled) {
          const username = connectionToken;
          const accountId = crypto.randomUUID();

          userList.push({
            clientId,
            accountId,
            username,
            apiToken: apiTokenHash,
            auth: {
              connectionToken: "AUTH_TOKEN",
            },
            ip,
            hemisphere,
          });
          return true;
        }

        if (state !== getState() && userList.length >= config.limits.players)
          return false;

        const { scopes: targetScopes } = await $auth.fetch({
          url: "user/@me/scopes",
          connectionToken,
        });
        if (!getScopes().every((scope) => targetScopes.includes(scope)))
          return false;

        const { accountId, username } = await $auth.fetch({
          url: "user/@me",
          connectionToken,
        });

        const foundUser = userList.find((user) => user.accountId === accountId);
        if (foundUser) {
          userClientMap[foundUser.clientId]?.close();
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
        });
        return true;
      },
    );
    server.on("connected", async (client: ServerClient) => {
      try {
        const foundUser: PrivateUser | undefined = userList.find(
          (user) => user.clientId === client.id,
        );

        if (!foundUser) return client?.close();

        let hasLoad = false;
        client.on(ProxyEvent.$LOAD, () => {
          if (hasLoad) return;
          hasLoad = true;

          client.emit(ProxyEvent.WELCOME, {
            datetime: Date.now(),
            user: {
              ...foundUser,
              apiToken: userTokenMap[foundUser.clientId],
            },
          });
          delete userTokenMap[foundUser.clientId];
        });
        // Wait if current user is connected to be disconnected
        await waitUntil(
          () =>
            !Object.values(clientIdAccountIdMap).includes(foundUser.accountId),
        );
        // Assign the accountId to the clientId. accountId can only be once as value.
        clientIdAccountIdMap[client?.id] = foundUser.accountId;

        userClientMap[foundUser.clientId] = client;
        serverWorker.emit(ProxyEvent.$USER_JOINED, {
          data: { user: foundUser },
        });

        client.on(ProxyEvent.$USER_DATA, ({ event, message }) => {
          try {
            // Disconnect client if tries to send events outside the whitelist
            if (!PROXY_CLIENT_EVENT_WHITELIST.includes(event))
              return client?.close?.();
            serverWorker.emit(ProxyEvent.$USER_DATA, {
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
    });
    server.on("disconnected", (client: ServerClient) => {
      try {
        if (!client?.id) return;

        const accountId = clientIdAccountIdMap[client.id];
        if (!accountId) return;

        const foundUser = userList.find((user) => user.accountId === accountId);
        if (!foundUser) return;

        delete userClientMap[client.id];
        delete clientIdAccountIdMap[client.id];

        userList = userList.filter((user) => user.clientId !== client.id);

        serverWorker.emit(ProxyEvent.$USER_LEFT, { data: { user: foundUser } });
      } catch (e) {
        console.error("proxy-8");
        console.error(e);
      }
    });
    log(`Started on :${config.port}`);
  };
  serverWorker.on("start", load);

  const getServer = () => server;
  const getServerWorker = () => serverWorker;

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  const getUser = (accountId: string): PrivateUser =>
    userList.find((user) => user.accountId === accountId);
  const getUserList = (): PrivateUser[] => userList;

  const getClient = (clientId: string) => userClientMap[clientId];
  const getRoom = (roomId: string) => server?.getRoom(roomId);

  const getState = (): string => state;

  const getScopes = (): Scope[] => [
    ...(getConfig().onet.enabled
      ? [
          Scope.ONET_FRIENDS_READ,
          Scope.ONET_FRIENDS_WRITE,
          Scope.ONET_MESSAGES_READ,
          Scope.ONET_MESSAGES_WRITE,
        ]
      : []),
  ];

  return {
    load,

    getServer,
    getServerWorker,

    getConfig,
    getEnvs,

    ///

    getUser,
    getUserList,

    getClient,
    getRoom,

    getState,
    getScopes,

    auth: $auth,
    coordinates: $coordinates,
  };
})();
