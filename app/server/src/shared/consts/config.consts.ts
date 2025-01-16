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
    enabled: false,
    licenseToken: "",
    api: "https://auth.openhotel.club",
  },
  onet: {
    enabled: false,
    api: "https://onet.openhotel.club",
  },
};
