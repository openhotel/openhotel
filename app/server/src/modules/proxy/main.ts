import { ModuleProps } from "shared/types/main.ts";
import { getClientSocket, getServerSocket } from "socket_ionic";
import { getParentWorker } from "worker_ionic";
import {
  getFreePort,
  getRandomString,
  initLog,
  log,
  wait,
} from "shared/utils/main.ts";

export const load = async (args: ModuleProps) => {
  await wait(50);
  initLog("PROXY");
  log(`Started!`);

  const proxyClientWorkerMap: Record<string, any> = {};

  let firewallClient;
  let isServerConnected = false;

  const serverClient = getClientSocket({
    url: `localhost:${args.internal.serverPort}`,
    protocols: [args.internal.token],
    silent: true,
  });
  const firewallsServer = getServerSocket(args.internal.proxyPort);

  serverClient.on("data", ({ event, message, userIdList }) => {});

  serverClient.on("connected", () => {
    log(">->-> Server");
    isServerConnected = true;
  });
  serverClient.on("disconnected", () => {
    log("-/ /- Server");
    isServerConnected = false;
  });

  firewallsServer.on(
    "guest",
    (clientId: string, [clientToken]) =>
      !firewallClient && clientToken === args.internal.token,
  );
  firewallsServer.on("connected", (client) => {
    log(">->-> Firewall");
    firewallClient = client;

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
        log("disconnected");
        serverClient.emit("left", { userId, username });

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
  firewallsServer.on("disconnected", (client) => {
    log("-/ /- Firewall");
  });

  setInterval(() => {
    const workers = Object.keys(proxyClientWorkerMap).length;
    if (!workers) return;

    log(`Current workers ${workers}/-1`);
  }, 5_000);

  await serverClient.connect();
};
