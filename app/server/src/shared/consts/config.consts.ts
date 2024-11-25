import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  version: "latest",
  name: "Open Hotel",
  description: "Welcome to the Hotel!",
  port: 1994,
  limits: {
    players: 100,
  },
  auth: {
    enabled: true,
    licenseToken: "",
    redirectUrl: "http://localhost:1994",
    api: "https://auth.openhotel.club",
  },
  onet: {
    enabled: true,
    api: "https://onet.openhotel.club",
  },
};
