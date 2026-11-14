import { load as loadEnv } from "loadenv";
import { getProcessedEnvs } from "shared/utils/main.ts";
import { System } from "modules/system/main.ts";
import { Envs } from "shared/types/envs.types.ts";

const envs: Envs = getProcessedEnvs({
  version: "__VERSION__",
  isDevelopment: false,
});

await loadEnv();
await System.load(envs);
