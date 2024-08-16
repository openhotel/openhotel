import { ConfigTypes } from "shared/types/config.types.ts";

export const CONFIG_DEFAULT: ConfigTypes = {
  port: 2024,
  url: "http://localhost:2024",
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
    hostname: "",
    port: 587,
    username: "",
    password: "",
  },
};
