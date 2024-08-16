import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  version: "latest",
  name: "Open Hotel",
  description: "Welcome to the Hotel!",
  client: {
    port: 1994,
  },
  limits: {
    players: 100,
  },
  proxy: {
    port: 2005,
    url: "http://localhost:2005",
  },
  auth: {
    redirectUrl: "http://localhost:1994",
    url: "http://localhost:2024",
    api: "http://localhost:2024/api/v2/server",
  },
};
