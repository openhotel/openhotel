import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  port: 2025,
  version: "latest",
  development: false,
  database: {
    filename: "database",
  },
  client: {
    url: "https://client.openhotel.club",
  },
  auth: {
    url: "https://auth.openhotel.club",
  },
};
