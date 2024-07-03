import { ConfigTypes } from "shared/types/main.ts";
import { initLog, isDevelopment, log } from "shared/utils/main.ts";
import { getParentWorker } from "worker_ionic";

export const load = async (config: ConfigTypes) => {
  // if (isDevelopment()) return;

  const clientWorker = getParentWorker({
    url: new URL("./client.worker.ts", import.meta.url).href,
  });
  clientWorker.emit("start", { config });
};
