import { getProcessedEnvs } from "shared/utils/main.ts";
import { System } from "modules/system/main.ts";
import { Envs } from "shared/types/envs.types.ts";
import { load as loadEnvs } from "@std/dotenv";

await loadEnvs({ export: true });
const envs: Envs = getProcessedEnvs({
  version: "__VERSION__",
  isDevelopment: false,
});

await System.load(envs);
