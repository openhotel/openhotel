import { Module } from "shared/enums/main.ts";
import { parseArgs } from "deno/cli/parse_args.ts";
import { load as loadFirewall } from "modules/firewall/main.ts";
import { load as loadProxy } from "modules/proxy/main.ts";
import { load as loadServer } from "modules/server/main.ts";
import { getRandomString, getFreePort } from "shared/utils/main.ts";
import { ModuleProps } from "shared/types/main.ts";

export const load = async () => {
  const { module, token, firewallPort, proxyPort, serverPort } = parseArgs(
    Deno.args,
  );

  const moduleProps: ModuleProps = {
    port: parseInt(Deno.env.get("PORT")),
    internal: {
      token: token || getRandomString(64),
      firewallPort: firewallPort || (await getFreePort()),
      proxyPort: proxyPort || (await getFreePort()),
      serverPort: serverPort || (await getFreePort()),
    },
  };

  if (!module) {
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
    spawnModule(Module.SERVER);
    spawnModule(Module.FIREWALL);
    spawnModule(Module.PROXY);
    return;
  }

  switch (module) {
    case Module.FIREWALL:
      await loadFirewall(moduleProps);
      return;
    case Module.PROXY:
      await loadProxy(moduleProps);
      return;
    case Module.SERVER:
      await loadServer(moduleProps);
      return;
  }
};
