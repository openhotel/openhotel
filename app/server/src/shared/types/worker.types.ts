import { ConfigTypes } from "./config.types.ts";
import { Envs } from "./envs.types.ts";

export type WorkerProps = {
  config: ConfigTypes;
  envs: Envs;
};
