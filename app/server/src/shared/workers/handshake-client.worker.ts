import { getChildWorker } from "worker_ionic";
import { getServerSocket } from "socket_ionic";
import { getRandomString } from "shared/utils/main.ts";

console.log = () => {};
const firewall = getChildWorker();

firewall.on("start", ({ port, token }) => {
  console.log(`Handshake start on :${port}`);

  let isConnected = false;

  const server = getServerSocket(port);
  server.on("guest", (clientId: string, [guestToken]) => token === guestToken);
  server.on("connected", (client) => {
    if (isConnected) return;
    isConnected = true;

    //TODO get the real userId
    const userId = getRandomString(16);
    //TODO go to auth Deno.env.get('AUTH_URL') to get the session
    firewall.on("proxy", async ({ port, token, userId }) => {
      client.emit("proxy", { port, token, userId });
      firewall.close();
    });
    client.on("session", async ({ username }) => {
      firewall.emit("open-proxy", { username, userId });
    });
  });
  server.on("disconnected", () => {
    firewall.close();
  });
  firewall.emit("start");
});

// close the worker if timeout
setTimeout(() => {
  firewall.close();
}, 10_000);
