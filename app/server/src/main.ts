import { load as loadProxy } from "modules/proxy/main.ts";
import { Server } from "modules/server/main.ts";
import { load as loadUpdater } from "modules/updater/main.ts";
import { getConfig, initLog } from "shared/utils/main.ts";
import { ConfigTypes } from "shared/types/config.types.ts";
import { Envs } from "shared/types/envs.types.ts";

export const load = async (envs: Envs) => {
  console.clear();

  if (envs.isDevelopment)
    console.log(
      "\n\n    ------------------\n    DEVELOPMENT SERVER\n    ------------------\n\n",
    );
  initLog(envs);

  const config: ConfigTypes = await getConfig();

  // Check for an update if true, close the server
  if (await loadUpdater({ config, envs })) return;

  // -> Load proxy
  const { proxyWorker } = await loadProxy({ config, envs });
  // Load server
  await Server.load({ config, envs, proxyWorker });
};
