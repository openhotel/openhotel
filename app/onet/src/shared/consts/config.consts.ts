import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULTS: ConfigTypes = {
  port: 9400,
  auth: {
    api: "http://localhost:2024/api/v2/server",
    key: "PRIVATE_KEY",
  },
};
