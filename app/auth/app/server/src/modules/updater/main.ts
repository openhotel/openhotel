import { Envs } from "shared/types/main.ts";
import { update } from "@oh/updater";

export const load = async (envs: Envs): Promise<boolean> => {
  if (envs.version === "DEVELOPMENT") return false;

  return update({
    targetVersion: "latest",
    version: envs.version,
    repository: "openhotel/auth",
    log: console.log,
    debug: console.debug,
  });
};
