import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  port: 2024,
  url: "http://localhost:2024",
  version: "latest",
  times: {
    accountTokenDays: 1,
    accountRefreshTokenDays: 7,
    accountWithoutVerificationDays: 1,

    connectionTokenMinutes: 20,
  },
  backups: {
    cron: "0 3 * * *",
  },
  accounts: {
    maxHotels: 3,
  },
  database: {
    filename: "database",
  },
  captcha: {
    enabled: false,
    id: "",
    token: "",
    url: "",
  },
  email: {
    enabled: false,
    hostname: "",
    port: 587,
    username: "",
    password: "",
  },
  github: {
    enabled: false,
    clientId: "",
    clientSecret: "",
  },
  notifications: {
    discord: false,
  },
};
