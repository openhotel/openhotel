import { ConfigTypes } from "shared/types/config.types.ts";

// @ignore-duplicate
export const CONFIG_DEFAULT: ConfigTypes = {
  port: 2030,
  url: "http://localhost:2030",
  version: "latest",
  auth: {
    enabled: false,
    appToken: "",
    url: "http://localhost:2024",
  },
};
