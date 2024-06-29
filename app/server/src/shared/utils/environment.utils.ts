import { config } from "../../../config.ts";

export const getVersion = () => config.version;

export const isDevelopment = () => getVersion() === '__VERSION__'