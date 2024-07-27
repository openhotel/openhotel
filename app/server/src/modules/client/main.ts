import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getParentWorker } from "worker_ionic";

export const load = async ({
  config,
  envs,
}: {
  config: ConfigTypes;
  envs: Envs;
}) => {
  if (envs.isDevelopment) return;

  const clientWorker = getParentWorker({
    url: new URL("./client.worker.ts", import.meta.url).href,
  });
  clientWorker.emit("start", { config, envs });
};
