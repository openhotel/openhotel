import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getParentWorker } from "worker_ionic";

export const load = async ({
  config,
  envs,
}: {
  config: ConfigTypes;
  envs: Envs;
}) => {
  const proxyWorker = getParentWorker({
    url: new URL("./proxy.worker.ts", import.meta.url).href,
  });
  proxyWorker.emit("start", { config, envs });

  return { proxyWorker };
};
