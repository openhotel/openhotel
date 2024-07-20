import { load } from "./src/main.ts";
import { load as loadEnv } from "loadenv";
import { getProcessedEnvs } from "shared/utils/main.ts";

const envs = getProcessedEnvs({
  version: "__VERSION__",
  isDevelopment: false,
});

await loadEnv();
await load(envs);
