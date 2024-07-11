import { System } from "./src/main.ts";
import { load as loadEnv } from "loadenv";
import { getProcessedEnvs } from "shared/utils/main.ts";

const envs = getProcessedEnvs({
  version: "__VERSION__",
});

loadEnv();
await System.load(envs);
