import { getChildWorker } from "worker_ionic";
import { getServerSocket } from "socket_ionic";

const worker = getChildWorker();

worker.on("start", ({ port, token }) => {
  console.log("<<<<", port, token);

  let isConnected = false;

  const server = getServerSocket(port);
  server.on("guest", (clientId: string, [guestToken]) => token === guestToken);
  server.on("connected", (client) => {
    if (isConnected) return;
    isConnected = true;

    //TODO go to auth Deno.env.get('AUTH_URL') to get the session
    worker.on("welcome", async ({ port, token }) => {
      client.emit("proxy", { port, token });
      worker.close();
    });
    client.on("session", async ({ username }) => {
      worker.emit("welcome", { username });
    });
  });
  server.on("disconnected", () => {
    worker.close();
  });
});

// close the worker if timeout
setTimeout(() => {
  worker.close();
}, 5_000);
