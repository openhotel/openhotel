import { config } from "../../../config.ts";

export const getVersion = () =>
  config.version === "__VERSION__" ? "DEVELOPMENT" : config.version;

export const isDevelopment = () => getVersion() === "DEVELOPMENT";
