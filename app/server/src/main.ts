import { load as loadProxy } from "modules/proxy/main.ts";
import { Server } from "modules/server/main.ts";
import { load as loadClient } from "modules/client/main.ts";
import { load as loadUpdater } from "modules/updater/main.ts";
import { getConfig, initLog } from "shared/utils/main.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";

export const load = async (envs: Envs) => {
  console.clear();

  if (envs.isDevelopment)
    console.log(
      "\n\n    ------------------\n    DEVELOPMENT SERVER\n    ------------------\n\n",
    );
  initLog();

  const config: ConfigTypes = await getConfig();

  // Check for an update if true, close the server
  if (await loadUpdater({ config, envs })) return;

  // -> Load proxy -> load firewall
  const { proxyWorker } = await loadProxy({ config, envs });
  // -> Load client
  await loadClient({ config, envs });
  // Load server
  Server.load({ config, envs, proxyWorker });
};
