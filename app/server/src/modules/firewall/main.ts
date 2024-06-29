import { Application, Router, RouterContext } from "oak";
import { oakCors } from "oakCors";
import {
  getRandomString,
  getFreePort,
  wait,
  initLog,
  log, getVersion,
} from "shared/utils/main.ts";
import { getClientSocket } from "socket_ionic";
import { getParentWorker } from "worker_ionic";
import { ModuleProps } from "shared/types/main.ts";

export const load = async (args: ModuleProps) => {
  await wait(100);
  initLog("FIREWALL");
  log(`Started!`);

  const handshakeClientWorkerMap: Record<string, any> = {};

  let isProxyConnected = false;

  const proxyClient = getClientSocket({
    url: `localhost:${args.internal.proxyPort}`,
    protocols: [args.internal.token],
    silent: true,
  });
  proxyClient.on("connected", () => {
    log(">->-> Proxy");
    isProxyConnected = true;
  });
  proxyClient.on("disconnected", () => {
    log("-/ /- Proxy");
    isProxyConnected = false;
  });

  proxyClient.on("open", ({ workerId, port, token, userId }) => {
    handshakeClientWorkerMap[workerId].emit("proxy", { port, token, userId });
  });

  setInterval(() => {
    const workers = Object.keys(handshakeClientWorkerMap).length;
    if (!workers) return;

    log(`Current workers ${workers}/-1`);
  }, 5_000);

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
      version: getVersion()
    };
  });
  router.get("/request", async (ctx: RouterContext<string, any, any>) => {
    const clientIPAddress: string = ctx.request.headers.get("host");

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

    handshakeClientWorkerMap[workerId].on("disconnected", () => {
      handshakeClientWorkerMap[workerId].close();
      delete handshakeClientWorkerMap[workerId];
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

    handshakeClientWorkerMap[workerId].emit("start", data);
    ctx.response.body = data;
  });
  log(`Listening on :${args.apiPort}`);
  app.listen({ port: args.apiPort });

  await proxyClient.connect();
  
};
