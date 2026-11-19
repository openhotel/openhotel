import { getProcessedEnvs } from "shared/utils/main.ts";
import { System } from "modules/system/main.ts";
import { load as loadEnvs } from "@std/dotenv";

await loadEnvs({ export: true });
const envs = getProcessedEnvs({
  version: "__VERSION__",
  //@ts-ignore
  upgrade: "__UPGRADE__",
});

System.load(envs);

const shutdown = async () => {
  await System.shutdown();
  Deno.exit(0);
};

Deno.addSignalListener("SIGTERM", shutdown);
Deno.addSignalListener("SIGINT", shutdown);
