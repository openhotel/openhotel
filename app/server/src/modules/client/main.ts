import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getParentWorker } from "worker_ionic";

export const load = async (config: ConfigTypes, envs: Envs) => {
  if (envs.version === "DEVELOPMENT") return;

  const clientWorker = getParentWorker({
    url: new URL("./client.worker.ts", import.meta.url).href,
  });
  clientWorker.emit("start", { config });
};
