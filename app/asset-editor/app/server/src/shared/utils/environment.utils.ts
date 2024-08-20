import { Envs } from "shared/types/main.ts";

export const isDevelopment = () => Deno.env.get("ENV") === "development";

export const getProcessedEnvs = ({ version }: Envs): Envs => ({
  version: version === "__VERSION__" ? "DEVELOPMENT" : version,
  isDevelopment: version === "__VERSION__",
});
