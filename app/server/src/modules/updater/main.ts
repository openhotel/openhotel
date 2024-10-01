import { ConfigTypes, Envs } from "shared/types/main.ts";
import { debug, log } from "shared/utils/main.ts";
import { update } from "@oh/updater";

export const load = async ({
  config,
  envs,
}: {
  config: ConfigTypes;
  envs: Envs;
}): Promise<boolean> => {
  if (envs.isDevelopment) return false;

  return update({
    targetVersion: config.version,
    version: envs.version,
    repository: "openhotel/openhotel",
    log,
    debug,
  });
};
