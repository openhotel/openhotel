import { load as loadEnv } from "loadenv";
import { getProcessedEnvs } from "shared/utils/main.ts";
import { System } from "modules/system/main.ts";

const envs = getProcessedEnvs({
  version: "development",
});

await loadEnv();
System.load(envs);
