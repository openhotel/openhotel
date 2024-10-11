import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";
import { debug, log } from "shared/utils/log.utils.ts";
import { update } from "@oh/utils";

export const updateEvent: ProxyEventType = {
  event: ProxyEvent.$UPDATE,
  func: async () => {
    const config = Proxy.getConfig();
    const envs = Proxy.getEnvs();

    if (
      envs.version !== "development" &&
      (await update({
        targetVersion: config.version,
        version: envs.version,
        repository: "openhotel/openhotel",
        log,
        debug,
      }))
    )
      Proxy.getServerWorker().emit(ProxyEvent.$STOP);
  },
};
