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
    handshakes: 10,
  },
  firewall: {
    port: 2001,
    url: "http://localhost:2001",
  },
  proxy: {
    port: 2005,
    url: "http://localhost:2005",
  },
  auth: {
    url: "http://localhost:2024",
  },
  captcha: {
    enabled: false,
    url: "",
    id: "",
  },
};
