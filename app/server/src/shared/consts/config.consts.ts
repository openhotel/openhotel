import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  version: "latest",
  name: "Open Hotel",
  description: "Welcome to the Hotel!",
  port: 1994,
  limits: {
    players: 100,
  },
  languages: ["en", "es"],
  auth: {
    enabled: false,
    licenseToken: "",
    api: "https://auth.openhotel.club",
  },
  onet: {
    enabled: false,
    api: "https://onet.openhotel.club",
  },
  phantom: {
    enabled: true,
    browser: {
      name: "chrome",
      buildId: "135.0.7049.114",
    },
    sleep: 60,
  },
  autoupdate: {
    enabled: true,
    cron: "0 4 * * *",
  },
};
