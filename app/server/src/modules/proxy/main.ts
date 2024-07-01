import { ConfigTypes, ModuleProps } from "shared/types/main.ts";
import { getClientSocket, getServerSocket } from "socket_ionic";
import { getParentWorker } from "worker_ionic";
import {
  debug,
  getFreePort,
  getRandomString,
  initLog,
  log,
  wait,
} from "shared/utils/main.ts";

export const load = async (args: ModuleProps, config: ConfigTypes) => {
  await wait(100);
  // initLog();

  const proxyClientWorkerMap: Record<string, any> = {};

  let firewallClient;
  let isServerConnected = false;

  const serverClient = getClientSocket({
    url: `localhost:${args.internal.serverPort}`,
    protocols: [args.internal.token],
    silent: true,
  });
  log(`localhost:${args.internal.serverPort}`, "proxy << serverClient");

  const onReady = async () => {
    log(`Proxy started!`);
  };
  const onDisconnected = (from: string) => {
    log(`Proxy disconnected! [${from}] (!)`);
  };

  serverClient.on("data", ({ event, message, userIdList }) => {});

  serverClient.on("connected", () => {
    isServerConnected = true;
  });
  serverClient.on("error", (error) => {
    debug("error", error);
  });
  serverClient.on("disconnected", (error) => {
    isServerConnected = false;
    debug("disconnected", error);
    onDisconnected("server");
  });

  await serverClient.connect();

  const firewallsServer = getServerSocket(args.internal.proxyPort);

  firewallsServer.on(
    "guest",
    (clientId: string, [clientToken]) =>
      !firewallClient && clientToken === args.internal.token,
  );
  firewallsServer.on("connected", (client) => {
    firewallClient = client;

    onReady();
    serverClient.emit("ready");

    firewallClient.on("open", async ({ username, workerId, userId }) => {
      const workerPort = await getFreePort();
      const workerToken = getRandomString(16);

      proxyClientWorkerMap[userId] = getParentWorker({
        url: new URL(
          "../../shared/workers/proxy-client.worker.ts",
          import.meta.url,
        ).href,
      });

      proxyClientWorkerMap[userId].on("joined", () => {
        serverClient.emit("joined", { userId, username });
      });
      proxyClientWorkerMap[userId].on("disconnected", () => {
        serverClient.emit("left", { userId, username });

        firewallClient.emit("close", { userId, username });

        proxyClientWorkerMap[userId].close();
        delete proxyClientWorkerMap[userId];
      });

      proxyClientWorkerMap[userId].on("data", ({ event, message }) => {
        serverClient.emit("data", { event, message, userId, username });
      });

      const data = {
        userId,
        workerId,
        username,
        port: workerPort,
        token: workerToken,
      };

      // We start listening on the worker
      proxyClientWorkerMap[userId].emit("start", data);
      // We inform firewall
      firewallClient.emit("open", data);
    });
  });
  firewallsServer.on("error", (error) => {
    debug("error", error);
  });
  firewallsServer.on("disconnected", (error) => {
    debug("disconnected", error);
    onDisconnected("firewall");
  });
};
