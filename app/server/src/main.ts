import { load as loadProxy } from "modules/proxy/main.ts";
import { load as loadServer } from "modules/server/main.ts";
import { load as loadClient } from "modules/client/main.ts";
import { load as loadUpdater } from "modules/updater/main.ts";
import { getConfig, initLog, isDevelopment } from "shared/utils/main.ts";
import { ConfigTypes } from "shared/types/main.ts";

export const load = async () => {
  console.clear();

  if (isDevelopment())
    console.log(
      "\n\n    ------------------\n    DEVELOPMENT SERVER\n    ------------------\n\n",
    );
  initLog();

  const config: ConfigTypes = await getConfig();

  // Check for an update if true, close the server
  if (await loadUpdater(config)) return;

  // -> Load proxy -> load firewall
  const { proxyWorker } = await loadProxy(config);
  // -> Load client
  await loadClient(config);
  // Load server
  await loadServer(config, proxyWorker);
};
