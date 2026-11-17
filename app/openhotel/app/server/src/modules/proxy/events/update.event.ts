import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";
import { System } from "modules/system/main.ts";

export const updateEvent: ProxyEventType = {
  event: ProxyEvent.$UPDATE,
  func: async () => {
    const config = Proxy.getConfig();
    const envs = Proxy.getEnvs();

    const canUpdate = await System.updater.update({
      version: envs.version,
      target: config.version,
      preReleases: true,
      stopOnUpdate: true,
    });
    if (canUpdate) Proxy.getServerWorker().emit(ProxyEvent.$STOP);
  },
};
