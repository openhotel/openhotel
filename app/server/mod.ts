import { load } from "./src/main.ts";
import { load as loadEnv } from "loadenv";
import { $setEnvironment } from "shared/utils/environment.utils.ts";

$setEnvironment({
  version: "__VERSION__",
});

await loadEnv();
await load();
