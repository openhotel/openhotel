import { getChildWorker } from "worker_ionic";
import { getServerSocket } from "socket_ionic";

console.log = () => {};
const proxy = getChildWorker();

let proxyServer;
let socketClient;

proxy.on("start", ({ port, token, userId, username }) => {
  console.log(`Proxy start on :${port} (${userId}::${username})`);

  proxyServer = getServerSocket(port);

  proxyServer.on(
    "guest",
    (clientId: string, [clientToken]) => !socketClient && clientToken === token,
  );
  proxyServer.on("connected", (client) => {
    socketClient = client;

    // Send the data from the client -> proxy -> server
    client.on("data", ({ event, message }) => {
      proxy.emit("data", { event, message });
    });
    proxy.emit("$$joined");
  });
  proxyServer.on("disconnected", (client) => {
    proxy.close();
  });
});
// Send the data from the client <- proxy <- server
proxy.on("data", ({ event, message }) => {
  socketClient.emit({ event, message });
});
