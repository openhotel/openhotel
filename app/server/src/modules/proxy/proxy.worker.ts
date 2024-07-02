import { initLog, log } from "shared/utils/main.ts";
import { getChildWorker, getParentWorker } from "worker_ionic";
import { WorkerProps } from "shared/types/main.ts";
import { getServerSocket } from "socket_ionic";

initLog();
const moduleWorker = getChildWorker();

moduleWorker.on("start", async ({ config }: WorkerProps) => {
  const firewallWorker = getParentWorker({
    url: new URL("../firewall/firewall.worker.ts", import.meta.url).href,
  });
  firewallWorker.emit("start", { config });

  const server = getServerSocket(config.ports.proxy, (request: Request) => {
    return new Response("404 Not found", { status: 404 });
  });
  log(`Proxy started on :${config.ports.proxy}`);
});
