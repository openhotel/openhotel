import { Application, Router, RouterContext } from "oak";
import { oakCors } from "oakCors";
import { getRandomString, getFreePort, wait } from "shared/utils/main.ts";
import { getClientSocket } from "socket_ionic";
import { getParentWorker } from "worker_ionic";
import { ModuleProps } from "shared/types/main.ts";

export const load = async (args: ModuleProps) => {
  await wait(150);
  console.log(`「OH FIREWALL」 Hello there!`);

  let isProxyConnected = false;

  const proxyClient = getClientSocket({
    url: `localhost:${args.internal.proxyPort}`,
    protocols: [args.internal.token],
    silent: true,
  });
  proxyClient.on("connected", () => {
    console.log("「OH FIREWALL」", ">->-> Proxy");
    isProxyConnected = true;
  });
  proxyClient.on("disconnected", () => {
    console.log("「OH FIREWALL」", "-/ /- Proxy");
    isProxyConnected = false;
  });
  await proxyClient.connect();

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

  const workerMap: Record<string, any> = {};

  router.get("/request", async (ctx: RouterContext<string, any, any>) => {
    const clientIPAddress: string = ctx.request.headers.get("host");

    //TODO Check slots available
    //TODO Check if proxy is ready
    const workerPort = await getFreePort();
    const workerId = getRandomString(16);
    const workerToken = getRandomString(16);

    workerMap[workerId] = getParentWorker({
      url: new URL(
        "../../shared/workers/handshake-client.worker.ts",
        import.meta.url,
      ).href,
    });

    workerMap[workerId].on("disconnected", () => {
      workerMap[workerId].close();
      delete workerMap[workerId];
    });
    workerMap[workerId].on("welcome", ({ username }) => {});

    workerMap[workerId].emit("start", {
      port: workerPort,
      token: workerToken,
    });
    ctx.response.body = {
      port: workerPort,
      token: workerToken,
    };
  });
  console.log(`「OH FIREWALL」`, `Listening on :${args.port}`);
  await app.listen({ port: args.port });

  //Start public server
  //Accept api (oak) petitions
  //Create worker for the client
};
