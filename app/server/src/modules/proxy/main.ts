import { ModuleProps } from "shared/types/main.ts";
import { getClientSocket, getServerSocket } from "socket_ionic";
import { getParentWorker } from "worker_ionic";
import { wait } from "shared/utils/main.ts";

export const load = async (args: ModuleProps) => {
  await wait(50);
  console.log(`「OH PROXY」 Hello there!`);

  const serverSocket = getClientSocket({
    url: `localhost:${args.internal.serverPort}`,
    protocols: [args.internal.token],
    silent: true,
  });

  const _getProxyWorker = (url: string) =>
    getParentWorker({
      url: new URL(url, import.meta.url).href,
    });

  let firewallsServerSocket;

  serverSocket.on("connected", () => {
    console.log("「OH PROXY」", ">->-> Server");

    serverSocket.on("data", ({ event, message, userIdList }) => {});

    firewallsServerSocket = getServerSocket(args.internal.proxyPort);

    firewallsServerSocket.on(
      "guest",
      (clientId: string, [clientToken]) => clientToken === args.internal.token,
    );
    firewallsServerSocket.on("connected", (client) => {
      console.log("「OH PROXY」", ">->-> Firewall");
    });
  });
  serverSocket.on("disconnected", () => {
    console.log("「OH PROXY」", "-/ /- Server");
    firewallsServerSocket.close();
  });

  // serverSocket.on("guest", () => true);
  // serverSocket.on("connected", (client) => {
  // 	console.log("hello there");
  //
  // 	const clientWorker = getParentWorker({
  // 		url: new URL(`./workers/client.worker.ts`, import.meta.url).href,
  // 	});
  //
  // 	clientWorker.on("data", ({ event, message }) => {
  // 		client.emit("data", { event, message });
  // 	});
  // 	client.on("data", ({ event, message }) => {
  // 		clientWorker.emit("data", { event, message });
  // 	});
  //
  // 	client.on("disconnected", () => {
  // 		clientWorker.close();
  // 	});
  // });

  await serverSocket.connect();
};
