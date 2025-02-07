import { Envs } from "shared/types/main.ts";
import { System } from "system/main.ts";

export const isDevelopment = () => System.getConfig().version === "development";

export const getProcessedEnvs = ({ version }: Envs): Envs => ({
  version: version === "__VERSION__" ? "development" : version,
});
