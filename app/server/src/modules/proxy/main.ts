import { log, parseChangelog } from "shared/utils/main.ts";
import { getChildWorker } from "worker_ionic";
import {
  ConfigTypes,
  Envs,
  VersionContent,
  WorkerProps,
} from "shared/types/main.ts";
import { getServerSocket, ServerClient } from "@da/socket";
import { Scope } from "shared/enums/main.ts";
import { routesList } from "./router/main.ts";
import { requestClient } from "./router/client.request.ts";
import {
  getRandomString,
  getURL,
  appendCORSHeaders,
  getIpFromRequest,
} from "@oh/utils";
import { eventList } from "./events/main.ts";
import { auth } from "../shared/auth.ts";
import { coordinates } from "../shared/coordinates.ts";
import { icon } from "modules/shared/icon.ts";
import { image } from "modules/shared/image.ts";
import { requestGame } from "./router/game.request.ts";
import { core } from "./core/main.ts";

export const Proxy = (() => {
  const serverWorker = getChildWorker();

  let userClientMap: Record<string, ServerClient> = {};
  let clientTypeMap: Record<string, string> = {};

  const state = getRandomString(64);

  const $image = image();
  const $icon = icon();
  const $auth = auth();
  const $coordinates = coordinates();
  let server;
  let $config: ConfigTypes;
  let $envs: Envs;
  let $changelog: VersionContent[] = [];

  const $core = core();

  const load = async ({ envs, config }: WorkerProps) => {
    $config = config;
    $envs = envs;

    await $image.load();
    await $icon.load();

    $coordinates.load(config);
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

        const clientResponse = await requestClient(request);
        if (clientResponse) return clientResponse;

        const gameResponse = await requestGame(request);
        if (gameResponse) return gameResponse;

        const foundRoute = routesList.find(
          (route) =>
            route.method.includes(method) &&
            pathname.startsWith(route.pathname),
        );

        let response = new Response("404", { status: 404 });
        if (foundRoute) response = await foundRoute.fn(request);
        try {
          appendCORSHeaders(response.headers);
        } catch (e) {}
        return response;
      },
    );

    server.on(
      "guest",
      async ({
        clientId,
        protocols: [connectionType, ...protocols],
        headers,
      }) => {
        let response = false;
        const ip = getIpFromRequest({ headers } as Request);

        switch (connectionType) {
          case "client":
            response = await $core.user.guest(clientId, protocols, ip);
            break;
          case "game":
            response = await $core.game.guest(clientId, protocols, ip);
            break;
        }
        if (response) clientTypeMap[clientId] = connectionType;

        return response;
      },
    );
    server.on("connected", async (client: ServerClient) => {
      userClientMap[client.id] = client;
      switch (clientTypeMap[client.id]) {
        case "client":
          return $core.user.connected(client);
        case "game":
          return $core.game.connected(client);
      }
      client.close();
    });
    server.on("disconnected", (client: ServerClient) => {
      switch (clientTypeMap[client.id]) {
        case "client":
          $core.user.disconnected(client);
          break;
        case "game":
          $core.game.disconnected(client);
          break;
      }
      delete userClientMap[client.id];
      delete clientTypeMap[client.id];
    });
    log(`Started on http://localhost:${config.port}`);
  };
  serverWorker.on("start", load);

  const getServer = () => server;
  const getServerWorker = () => serverWorker;

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

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

  const getChangelog = async () => {
    if ($changelog.length) return $changelog;

    const rawChangelog = await fetch(
      "https://raw.githubusercontent.com/openhotel/openhotel/master/CHANGELOG.md",
    ).then((response) => response.text());

    const changelog = parseChangelog(rawChangelog);

    const foundVersion = changelog.find((c) => c.version === $config.version);
    if (foundVersion) $changelog = changelog;

    return $changelog;
  };

  return {
    load,

    getServer,
    getServerWorker,

    getConfig,
    getEnvs,

    getClient,
    getRoom,

    getState,
    getScopes,

    getChangelog,

    image: $image,
    icon: $icon,
    auth: $auth,
    coordinates: $coordinates,
    core: $core,
  };
})();
