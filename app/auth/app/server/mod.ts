import { System } from "modules/system/main.ts";
import { getProcessedEnvs } from "shared/utils/main.ts";

const envs = getProcessedEnvs({
  version: "__VERSION__",
});

await System.load(envs, Deno.args.includes("--testMode"));
