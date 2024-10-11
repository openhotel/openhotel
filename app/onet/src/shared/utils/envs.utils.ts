import { Envs } from "shared/types/main.ts";

export const getProcessedEnvs = ({ version }: Envs): Envs => ({
  version: version === "__VERSION__" ? "development" : version,
  isDevelopment: version === "__VERSION__",
});
