import { Envs } from "shared/types/main.ts";
import { System } from "system/main.ts";

export const isDevelopment = () => System.getEnvs().isDevelopment;

export const getProcessedEnvs = ({ version }: Envs): Envs => ({
  version: version === "__VERSION__" ? "DEVELOPMENT" : version,
  isDevelopment: version === "__VERSION__",
});
