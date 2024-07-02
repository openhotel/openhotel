import {
  appendCORSHeaders,
  getCORSHeaders,
  getFreePort,
  getRandomString,
  getVersion,
  initLog,
  log,
} from "shared/utils/main.ts";
import { getChildWorker } from "worker_ionic";
import { WorkerProps } from "shared/types/main.ts";
import { routesList } from "./router/main.ts";
import { getServerSocket } from "socket_ionic";

initLog();
const proxyWorker = getChildWorker();

proxyWorker.on("start", async ({ config }: WorkerProps) => {
  // const app = new Application({});
  // app.use(
  //   oakCors({
  //     origin: "*",
  //   }),
  // );
  //
  // const router = new Router();
  // app.use(router.routes());
  // app.use(router.allowedMethods());
  //
  // router.get("/request", getRequest({ config }));
  // app.listen({ port: config.ports.firewall });

  const server = getServerSocket(
    config.ports.firewall,
    async (request: Request) => {
      const { method, url } = request;
      const { pathname } = new URL(url);

      const foundRoute = routesList.find(
        (route) => route.method === method && route.pathname === pathname,
      );

      let response = new Response("404 Not found", { status: 404 });
      if (foundRoute) response = await foundRoute.fn(request, config);

      appendCORSHeaders(response.headers);
      return response;
    },
  );
  log(`Firewall started on :${config.ports.firewall}`);
});
