import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  port: 1995,
  url: "http://localhost:1995",
  version: "latest",
  auth: {
    enabled: false,
    appToken: "",
    url: "http://localhost:2024",
  },
  database: {
    filename: "database",
    backupName: "database-backups",
  },
  s3: {
    enabled: false,
    accessKey: "",
    secretKey: "",
    endpoint: "",
    region: "",
    bucket: "",
  },
};
