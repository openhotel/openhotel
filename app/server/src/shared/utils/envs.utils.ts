import { Envs } from "shared/types/main.ts";

export const getProcessedEnvs = ({ version, upgrade }: Envs): Envs => ({
  version: version === "__VERSION__" ? "development" : version,
  upgrade: version !== "__VERSION__" && upgrade,
});
