import { ModuleProps } from "shared/types/main.ts";
import { getServerSocket } from "socket_ionic";
import { wait } from "shared/utils/main.ts";

export const load = async (args: ModuleProps) => {
  await wait(0);
  console.log(`「OH SERVER」 Hello there!`);

  const proxyServerSocket = getServerSocket(args.internal.serverPort);
  let proxyServerClient;

  proxyServerSocket.on(
    "guest",
    (clientId: string, [clientToken]) =>
      !proxyServerClient && clientToken === args.internal.token,
  );
  proxyServerSocket.on("connected", (proxyClient) => {
    proxyServerClient = proxyClient;
    console.log("「OH SERVER」", ">->-> Proxy");

    proxyServerClient.on(
      "data",
      async ({ userId, username, event, message }) => {
        console.log("「OH SERVER」", userId, username, event, message);
      },
    );
  });
  proxyServerSocket.on("disconnected", (proxyClient) => {
    console.log("「OH SERVER」", "-/ /- Proxy");
  });
};
