import { Module } from "shared/enums/main.ts";
import { parseArgs } from "deno/cli/parse_args.ts";
import { load as loadFirewall } from "modules/firewall/main.ts";
import { load as loadProxy } from "modules/proxy/main.ts";
import { load as loadServer } from "modules/server/main.ts";
import { load as loadClient } from "modules/client/main.ts";
import { load as loadUpdater } from "modules/updater/main.ts";
import {
  getRandomString,
  getFreePort,
  getConfig,
  log,
} from "shared/utils/main.ts";
import { ConfigTypes, ModuleProps } from "shared/types/main.ts";

export const load = async () => {
  const { module, token, firewallPort, proxyPort, serverPort } = parseArgs(
    Deno.args,
  );

  const moduleProps: ModuleProps = {
    internal: {
      token: token || getRandomString(64),
      firewallPort: firewallPort || (await getFreePort()),
      proxyPort: proxyPort || (await getFreePort()),
      serverPort: serverPort || (await getFreePort()),
    },
  };
  log(moduleProps);

  const config: ConfigTypes = await getConfig();

  if (!module) {
    const needsToUpdate = await loadUpdater(moduleProps, config);
    if (needsToUpdate) return;

    const spawnModule = (module: Module) => {
      const process = new Deno.Command(Deno.execPath(), {
        args: [
          `--module=${module}`,
          `--token=${moduleProps.internal.token}`,
          `--serverPort=${moduleProps.internal.serverPort}`,
          `--firewallPort=${moduleProps.internal.firewallPort}`,
          `--proxyPort=${moduleProps.internal.proxyPort}`,
        ],
      });
      process.spawn();
    };
    spawnModule(Module.CLIENT);
    spawnModule(Module.SERVER);
    spawnModule(Module.FIREWALL);
    spawnModule(Module.PROXY);
    return;
  }

  switch (module) {
    case Module.CLIENT:
      await loadClient(moduleProps, config);
      return;
    case Module.FIREWALL:
      await loadFirewall(moduleProps, config);
      return;
    case Module.PROXY:
      await loadProxy(moduleProps, config);
      return;
    case Module.SERVER:
      await loadServer(moduleProps, config);
      return;
    case Module.UPDATER:
      await loadUpdater(moduleProps, config);
      return;
  }
};
