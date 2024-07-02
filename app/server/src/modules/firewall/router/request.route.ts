import { getVersion, getFreePort, getRandomString } from "shared/utils/main.ts";
import { ConfigTypes } from "shared/types/main.ts";

export const getRequest = {
  method: "GET",
  pathname: "/request",
  fn: async (request: Request, config: ConfigTypes): Promise<Response> => {
    return new Response("200", { status: 200 });
    // const clientIPAddress: string = request.headers.get("host");
    // const clientVersion = new URLSearchParams(ctx.request.url.search).get(
    //   "version",
    // );
    //
    // if (userList.length >= config.limits.players) {
    //   ctx.response.status = 406;
    //   ctx.response.body = {
    //     error: 406,
    //     message: ["Hotel is full", "Please try again in a few minutes"],
    //   };
    //   return;
    // }
    //
    // if (
    //   Object.keys(handshakeClientWorkerMap).length >= config.limits.handshake
    // ) {
    //   ctx.response.status = 406;
    //   ctx.response.body = {
    //     error: 406,
    //     message: [
    //       "Cannot handshake right now",
    //       "Please try again in a few minutes",
    //     ],
    //   };
    //   return;
    // }
    //
    // const version = getVersion();
    // if (clientVersion !== version) {
    //   ctx.response.status = 406;
    //   ctx.response.body = {
    //     error: 406,
    //     message: [
    //       "Version mismatch",
    //       `Expected (${version}) != ${clientVersion}`,
    //     ],
    //   };
    //   return;
    // }
    //
    // //TODO Check slots available
    // //TODO Check if proxy is ready
    // const workerPort = await getFreePort();
    // const workerId = getRandomString(16);
    // const workerToken = getRandomString(16);
    //
    // // handshakeClientWorkerMap[workerId] = getParentWorker({
    // // 	url: new URL(
    // // 		"../../shared/workers/handshake-client.worker.ts",
    // // 		import.meta.url,
    // // 	).href,
    // // });
    //
    // handshakeClientWorkerMap[workerId].on("disconnected", () => {
    //   handshakeClientWorkerMap[workerId].close();
    //   delete handshakeClientWorkerMap[workerId];
    //
    //   printWorkers();
    // });
    // handshakeClientWorkerMap[workerId].on(
    //   "open-proxy",
    //   ({ username, userId }) => {
    //     proxyClient.emit("open", { username, workerId, userId });
    //   },
    // );
    //
    // const data = {
    //   port: workerPort,
    //   token: workerToken,
    // };
    //
    // // Be sure handshake has started!
    // await new Promise((resolve) => {
    //   handshakeClientWorkerMap[workerId].on("start", () => {
    //     resolve(1);
    //   });
    //   handshakeClientWorkerMap[workerId].emit("start", data);
    // });
    // ctx.response.body = data;
  },
};
