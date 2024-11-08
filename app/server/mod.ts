import { load as loadEnv } from "loadenv";
import { getProcessedEnvs } from "shared/utils/main.ts";
import { System } from "modules/system/main.ts";

const envs = getProcessedEnvs({
  version: "v1.0.0",
});

await loadEnv();
System.load(envs);
