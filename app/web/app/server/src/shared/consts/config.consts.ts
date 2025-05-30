import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  port: 2025,
  url: "http://localhost:2025",
  version: "latest",
  backups: {
    pathname: "./backups",
    max: 60,
    password: "",
    cron: "0 3 * * *",
    s3: {
      enabled: false,
      accessKey: "",
      secretKey: "",
      endpoint: "",
      region: "",
      bucket: "",
    },
  },
  database: {
    filename: "database",
  },
};
