import { System } from "modules/system/main.ts";
import { debug, log } from "shared/utils/log.utils.ts";
import { update } from "@oh/utils";

export const updater = () => {
  const $update = async () => {
    const envs = System.getEnvs();
    const config = System.config.get();

    const isDevelopment = envs.version === "development";

    if (isDevelopment || !envs.upgrade) return;

    console.info(
      `Trying to update from ${envs.version} to ${config.version}...`,
    );
    if (
      await update({
        targetVersion: config.version,
        version: envs.version,
        repository: "openhotel/openhotel",
        log,
        debug,
      })
    )
      //@ts-ignore
      Deno.exit();
  };

  const load = async () => {
    const config = System.config.get();

    await $update();

    if (!config.autoupdate.enabled) return;

    Deno.cron("updater cron", config.autoupdate.cron, $update);
  };

  return {
    load,
  };
};
