import { Application, Router, RouterContext } from "oak";
import { oakCors } from "oakCors";
import {
  getRandomString,
  getFreePort,
  wait,
  initLog,
  log,
  getVersion,
} from "shared/utils/main.ts";
import { getClientSocket } from "socket_ionic";
import { getParentWorker } from "worker_ionic";
import { ConfigTypes } from "shared/types/main.ts";

export const load = async (config: ConfigTypes) => {
  let userList: { userId: string; username: string }[] = [];
  const handshakeClientWorkerMap: Record<string, any> = {};

  let isProxyConnected = false;

  const printWorkers = () =>
    log(
      `(${Object.keys(handshakeClientWorkerMap).length}/${config.limits.handshake}) Handshakes`,
    );
  const printUsers = () =>
    log(`(${userList.length}/${config.limits.players}) Players`);

  const proxyClient = getClientSocket({
    url: `localhost:${args.internal.proxyPort}`,
    protocols: [args.internal.token],
    silent: true,
  });
  proxyClient.on("connected", () => {
    log(`Firewall started!`);
    isProxyConnected = true;
  });
  proxyClient.on("disconnected", () => {
    log("Firewall disconnected! (!)");
    isProxyConnected = false;
  });

  proxyClient.on("open", ({ workerId, port, token, userId, username }) => {
    userList.push({ userId, username });
    handshakeClientWorkerMap[workerId].emit("proxy", { port, token, userId });
    printUsers();
  });

  proxyClient.on("close", ({ userId, username }) => {
    userList = userList.filter((user) => user.userId !== userId);
    printUsers();
  });

  //### API ############################################################################################################

  const app = new Application();
  app.use(
    oakCors({
      origin: "*",
    }),
  );

  const router = new Router();
  app.use(router.routes());
  app.use(router.allowedMethods());

  router.get("/version", async (ctx: RouterContext<string, any, any>) => {
    ctx.response.body = {
      version: getVersion(),
    };
  });
  router.get("/request", async (ctx: RouterContext<string, any, any>) => {
    const clientIPAddress: string = ctx.request.headers.get("host");
    const clientVersion = new URLSearchParams(ctx.request.url.search).get(
      "version",
    );

    if (userList.length >= config.limits.players) {
      ctx.response.status = 406;
      ctx.response.body = {
        error: 406,
        message: ["Hotel is full", "Please try again in a few minutes"],
      };
      return;
    }

    if (
      Object.keys(handshakeClientWorkerMap).length >= config.limits.handshake
    ) {
      ctx.response.status = 406;
      ctx.response.body = {
        error: 406,
        message: [
          "Cannot handshake right now",
          "Please try again in a few minutes",
        ],
      };
      return;
    }

    const version = getVersion();
    if (clientVersion !== version) {
      ctx.response.status = 406;
      ctx.response.body = {
        error: 406,
        message: [
          "Version mismatch",
          `Expected (${version}) != ${clientVersion}`,
        ],
      };
      return;
    }

    //TODO Check slots available
    //TODO Check if proxy is ready
    const workerPort = await getFreePort();
    const workerId = getRandomString(16);
    const workerToken = getRandomString(16);

    handshakeClientWorkerMap[workerId] = getParentWorker({
      url: new URL(
        "../../shared/workers/handshake-client.worker.ts",
        import.meta.url,
      ).href,
    });
    printWorkers();

    handshakeClientWorkerMap[workerId].on("disconnected", () => {
      handshakeClientWorkerMap[workerId].close();
      delete handshakeClientWorkerMap[workerId];

      printWorkers();
    });
    handshakeClientWorkerMap[workerId].on(
      "open-proxy",
      ({ username, userId }) => {
        proxyClient.emit("open", { username, workerId, userId });
      },
    );

    const data = {
      port: workerPort,
      token: workerToken,
    };

    // Be sure handshake has started!
    await new Promise((resolve) => {
      handshakeClientWorkerMap[workerId].on("start", () => {
        resolve(1);
      });
      handshakeClientWorkerMap[workerId].emit("start", data);
    });
    ctx.response.body = data;
  });
  app.listen({ port: config.ports.server });

  await proxyClient.connect();
};
